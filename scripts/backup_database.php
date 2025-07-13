<?php
declare(strict_types=1);

/**
 * Script de sauvegarde complète de la base de données Pet Paradise
 * Génère un fichier SQL avec structure + données
 */

// Configuration de la base de données
$host = $_ENV['PGHOST'] ?? 'localhost';
$port = $_ENV['PGPORT'] ?? '5432';
$dbname = $_ENV['PGDATABASE'] ?? 'petparadise';
$username = $_ENV['PGUSER'] ?? 'postgres';
$password = $_ENV['PGPASSWORD'] ?? '';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    $backupFile = 'database_backup_' . date('Y-m-d_H-i-s') . '.sql';
    $output = [];
    
    // En-tête du fichier SQL
    $output[] = "-- Pet Paradise Database Backup";
    $output[] = "-- Generated: " . date('Y-m-d H:i:s');
    $output[] = "-- PostgreSQL Database Dump";
    $output[] = "";
    $output[] = "SET statement_timeout = 0;";
    $output[] = "SET lock_timeout = 0;";
    $output[] = "SET client_encoding = 'UTF8';";
    $output[] = "SET standard_conforming_strings = on;";
    $output[] = "SET check_function_bodies = false;";
    $output[] = "SET xmloption = content;";
    $output[] = "SET client_min_messages = warning;";
    $output[] = "";
    
    // Ordre des tables pour éviter les conflits de clés étrangères
    $tables = [
        'users',
        'rooms', 
        'room_pricing',
        'service_pricing',
        'room_schedule',
        'custom_messages',
        'reservations',
        'contact_messages',
        'faq_items',
        'blog_posts',
        'site_settings'
    ];
    
    foreach ($tables as $table) {
        echo "Sauvegarde de la table: $table\n";
        
        // Vérifier si la table existe
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?");
        $stmt->execute([$table]);
        
        if ($stmt->fetchColumn() == 0) {
            echo "⚠️  Table $table n'existe pas, ignorée\n";
            continue;
        }
        
        $output[] = "-- Table: $table";
        $output[] = "DROP TABLE IF EXISTS $table CASCADE;";
        
        // Obtenir la structure de la table
        $createTableSQL = getTableStructure($pdo, $table);
        $output[] = $createTableSQL;
        $output[] = "";
        
        // Obtenir les données
        $stmt = $pdo->prepare("SELECT * FROM $table");
        $stmt->execute();
        $rows = $stmt->fetchAll();
        
        if (!empty($rows)) {
            $output[] = "-- Données pour la table $table";
            
            // Obtenir les noms des colonnes
            $columns = array_keys($rows[0]);
            $columnList = implode(', ', array_map(function($col) {
                return '"' . $col . '"';
            }, $columns));
            
            $output[] = "INSERT INTO $table ($columnList) VALUES";
            
            $values = [];
            foreach ($rows as $row) {
                $rowValues = [];
                foreach ($row as $value) {
                    if ($value === null) {
                        $rowValues[] = 'NULL';
                    } elseif (is_bool($value)) {
                        $rowValues[] = $value ? 'true' : 'false';
                    } elseif (is_numeric($value)) {
                        $rowValues[] = $value;
                    } else {
                        $rowValues[] = "'" . addslashes($value) . "'";
                    }
                }
                $values[] = '(' . implode(', ', $rowValues) . ')';
            }
            
            $output[] = implode(",\n", $values) . ";";
            $output[] = "";
        }
        
        // Réinitialiser la séquence pour les colonnes SERIAL
        $sequenceSQL = resetSequence($pdo, $table);
        if ($sequenceSQL) {
            $output[] = $sequenceSQL;
            $output[] = "";
        }
    }
    
    // Ajouter les contraintes et index
    $output[] = "-- Contraintes et index";
    $constraints = getConstraints($pdo);
    foreach ($constraints as $constraint) {
        $output[] = $constraint;
    }
    
    // Sauvegarder le fichier
    $sqlContent = implode("\n", $output);
    file_put_contents($backupFile, $sqlContent);
    
    echo "\n✅ Sauvegarde terminée: $backupFile\n";
    echo "Taille du fichier: " . formatBytes(filesize($backupFile)) . "\n";
    echo "Tables sauvegardées: " . count($tables) . "\n";
    
    // Afficher les statistiques
    echo "\n=== STATISTIQUES ===\n";
    foreach ($tables as $table) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?");
        $stmt->execute([$table]);
        
        if ($stmt->fetchColumn() > 0) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM $table");
            $stmt->execute();
            $count = $stmt->fetchColumn();
            echo "- $table: $count lignes\n";
        }
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur de base de données: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    exit(1);
}

/**
 * Obtenir la structure SQL d'une table
 */
function getTableStructure(PDO $pdo, string $table): string {
    $sql = "SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
    FROM information_schema.columns 
    WHERE table_name = ? 
    ORDER BY ordinal_position";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$table]);
    $columns = $stmt->fetchAll();
    
    $createSQL = "CREATE TABLE $table (\n";
    $columnDefs = [];
    
    foreach ($columns as $column) {
        $name = $column['column_name'];
        $type = $column['data_type'];
        $nullable = $column['is_nullable'] === 'YES' ? '' : ' NOT NULL';
        $default = $column['column_default'];
        
        // Convertir les types PostgreSQL
        $columnType = convertPostgreSQLType($type, $column);
        
        $columnDef = "    \"$name\" $columnType$nullable";
        
        if ($default !== null) {
            if (strpos($default, 'nextval') !== false) {
                // C'est une séquence (SERIAL)
                $columnDef = str_replace($columnType, 'SERIAL', $columnDef);
                $columnDef = str_replace($nullable, '', $columnDef);
            } else {
                $columnDef .= " DEFAULT $default";
            }
        }
        
        $columnDefs[] = $columnDef;
    }
    
    // Ajouter les contraintes PRIMARY KEY
    $primaryKey = getPrimaryKey($pdo, $table);
    if ($primaryKey) {
        $columnDefs[] = "    PRIMARY KEY ($primaryKey)";
    }
    
    $createSQL .= implode(",\n", $columnDefs);
    $createSQL .= "\n);";
    
    return $createSQL;
}

/**
 * Convertir les types PostgreSQL
 */
function convertPostgreSQLType(string $type, array $column): string {
    switch ($type) {
        case 'character varying':
            $length = $column['character_maximum_length'];
            return $length ? "VARCHAR($length)" : 'VARCHAR(255)';
        case 'text':
            return 'TEXT';
        case 'integer':
            return 'INTEGER';
        case 'boolean':
            return 'BOOLEAN';
        case 'date':
            return 'DATE';
        case 'timestamp without time zone':
            return 'TIMESTAMP';
        case 'numeric':
            $precision = $column['numeric_precision'];
            $scale = $column['numeric_scale'];
            return "DECIMAL($precision,$scale)";
        case 'json':
        case 'jsonb':
            return 'JSON';
        default:
            return strtoupper($type);
    }
}

/**
 * Obtenir la clé primaire
 */
function getPrimaryKey(PDO $pdo, string $table): ?string {
    $sql = "SELECT column_name 
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_name = ? AND tc.constraint_type = 'PRIMARY KEY'";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$table]);
    $result = $stmt->fetch();
    
    return $result ? '"' . $result['column_name'] . '"' : null;
}

/**
 * Réinitialiser les séquences
 */
function resetSequence(PDO $pdo, string $table): ?string {
    $sql = "SELECT column_name, column_default
            FROM information_schema.columns 
            WHERE table_name = ? AND column_default LIKE 'nextval%'";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$table]);
    $sequences = $stmt->fetchAll();
    
    if (empty($sequences)) {
        return null;
    }
    
    $resetSQL = [];
    foreach ($sequences as $seq) {
        $column = $seq['column_name'];
        $resetSQL[] = "SELECT setval(pg_get_serial_sequence('$table', '$column'), COALESCE(MAX($column), 1)) FROM $table;";
    }
    
    return implode("\n", $resetSQL);
}

/**
 * Obtenir les contraintes
 */
function getConstraints(PDO $pdo): array {
    $sql = "SELECT 
        tc.constraint_name,
        tc.table_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
    LEFT JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type IN ('FOREIGN KEY', 'UNIQUE', 'CHECK')
    ORDER BY tc.table_name, tc.constraint_name";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $constraints = $stmt->fetchAll();
    
    $constraintSQL = [];
    foreach ($constraints as $constraint) {
        $table = $constraint['table_name'];
        $type = $constraint['constraint_type'];
        $column = $constraint['column_name'];
        
        if ($type === 'FOREIGN KEY') {
            $foreignTable = $constraint['foreign_table_name'];
            $foreignColumn = $constraint['foreign_column_name'];
            $constraintSQL[] = "ALTER TABLE $table ADD CONSTRAINT {$constraint['constraint_name']} FOREIGN KEY ($column) REFERENCES $foreignTable($foreignColumn);";
        } elseif ($type === 'UNIQUE') {
            $constraintSQL[] = "ALTER TABLE $table ADD CONSTRAINT {$constraint['constraint_name']} UNIQUE ($column);";
        }
    }
    
    return $constraintSQL;
}

/**
 * Formater la taille des fichiers
 */
function formatBytes(int $bytes): string {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, 2) . ' ' . $units[$pow];
}

echo "\n🎉 Script de sauvegarde terminé avec succès!\n";
?>
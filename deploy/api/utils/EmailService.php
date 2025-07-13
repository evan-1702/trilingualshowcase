<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private PHPMailer $mailer;
    
    public function __construct() {
        $this->mailer = new PHPMailer(true);
        $this->configureSMTP();
    }
    
    private function configureSMTP(): void {
        try {
            $this->mailer->isSMTP();
            $this->mailer->Host = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = $_ENV['SMTP_USER'] ?? '';
            $this->mailer->Password = $_ENV['SMTP_PASS'] ?? '';
            $this->mailer->SMTPSecure = ($_ENV['SMTP_SECURE'] ?? 'false') === 'true' 
                ? PHPMailer::ENCRYPTION_SMTPS 
                : PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port = (int)($_ENV['SMTP_PORT'] ?? '587');
            $this->mailer->CharSet = 'UTF-8';
        } catch (Exception $e) {
            error_log("SMTP configuration error: " . $e->getMessage());
        }
    }
    
    public function sendReservationConfirmation(array $reservation): bool {
        if (empty($_ENV['SMTP_USER']) || empty($_ENV['SMTP_PASS'])) {
            error_log('SMTP credentials not configured');
            return false;
        }
        
        try {
            $animals = json_decode($reservation['animals'], true) ?? [];
            $siteEmail = $_ENV['SITE_EMAIL'] ?? 'contact@petparadise.com';
            
            // Send customer confirmation
            $this->sendCustomerEmail($reservation, $animals, $siteEmail);
            
            // Send admin notification
            $this->sendAdminEmail($reservation, $animals, $siteEmail);
            
            return true;
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
            return false;
        }
    }
    
    private function sendCustomerEmail(array $reservation, array $animals, string $siteEmail): void {
        $this->mailer->clearAddresses();
        $this->mailer->setFrom($_ENV['SMTP_USER'], 'Pet Paradise');
        $this->mailer->addAddress($reservation['customer_email']);
        $this->mailer->Subject = 'Confirmation de votre demande de réservation - Pet Paradise';
        
        $animalsList = array_map(function($animal) {
            return htmlspecialchars($animal['name'] ?? '') . ' (' . htmlspecialchars($animal['type'] ?? '') . ')';
        }, $animals);
        
        $this->mailer->isHTML(true);
        $this->mailer->Body = $this->getCustomerEmailTemplate(
            $reservation['customer_first_name'],
            $reservation['customer_name'],
            $reservation['start_date'],
            $reservation['end_date'],
            $reservation['number_of_animals'],
            implode(', ', $animalsList),
            $siteEmail
        );
        
        $this->mailer->send();
    }
    
    private function sendAdminEmail(array $reservation, array $animals, string $siteEmail): void {
        $this->mailer->clearAddresses();
        $this->mailer->setFrom($_ENV['SMTP_USER'], 'Pet Paradise System');
        $this->mailer->addAddress($siteEmail);
        $this->mailer->Subject = "Nouvelle demande de réservation - {$reservation['customer_first_name']} {$reservation['customer_name']}";
        
        $animalsList = array_map(function($animal) {
            return htmlspecialchars($animal['name'] ?? '') . ' (' . htmlspecialchars($animal['type'] ?? '') . ')';
        }, $animals);
        
        $this->mailer->isHTML(true);
        $this->mailer->Body = $this->getAdminEmailTemplate(
            $reservation['customer_first_name'],
            $reservation['customer_name'],
            $reservation['customer_email'],
            $reservation['customer_phone'],
            $reservation['customer_address'],
            $reservation['start_date'],
            $reservation['end_date'],
            $reservation['number_of_animals'],
            implode(', ', $animalsList)
        );
        
        $this->mailer->send();
    }
    
    private function getCustomerEmailTemplate(
        string $firstName, 
        string $lastName, 
        string $startDate, 
        string $endDate, 
        int $numberOfAnimals, 
        string $animalsList, 
        string $siteEmail
    ): string {
        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
          <div style='background-color: #8B6F5B; color: white; padding: 20px; text-align: center;'>
            <h1>Pet Paradise</h1>
            <h2>Confirmation de demande de réservation</h2>
          </div>
          
          <div style='padding: 20px;'>
            <p>Bonjour " . htmlspecialchars($firstName) . " " . htmlspecialchars($lastName) . ",</p>
            
            <p>Nous avons bien reçu votre demande de réservation pour un séjour du <strong>" . htmlspecialchars($startDate) . "</strong> au <strong>" . htmlspecialchars($endDate) . "</strong>.</p>
            
            <div style='background-color: #F9F5EF; padding: 15px; border-radius: 5px; margin: 20px 0;'>
              <h3>Détails de votre demande :</h3>
              <ul>
                <li><strong>Dates :</strong> Du " . htmlspecialchars($startDate) . " au " . htmlspecialchars($endDate) . "</li>
                <li><strong>Nombre d'animaux :</strong> " . $numberOfAnimals . "</li>
                <li><strong>Animaux :</strong> " . $animalsList . "</li>
              </ul>
            </div>
            
            <p><strong>Prochaines étapes :</strong></p>
            <ul>
              <li>Nous allons examiner votre demande dans les plus brefs délais</li>
              <li>Vous recevrez une confirmation définitive par email sous 24-48h</li>
              <li>En cas de questions, n'hésitez pas à nous contacter</li>
            </ul>
            
            <p>Merci de votre confiance,<br>L'équipe Pet Paradise</p>
            
            <div style='background-color: #F0EAE2; padding: 15px; border-radius: 5px; margin-top: 30px; text-align: center;'>
              <p style='margin: 0; font-size: 14px; color: #666;'>
                Cet email est envoyé automatiquement, merci de ne pas y répondre directement.<br>
                Pour toute question, contactez-nous à : " . htmlspecialchars($siteEmail) . "
              </p>
            </div>
          </div>
        </div>";
    }
    
    private function getAdminEmailTemplate(
        string $firstName,
        string $lastName,
        string $email,
        string $phone,
        string $address,
        string $startDate,
        string $endDate,
        int $numberOfAnimals,
        string $animalsList
    ): string {
        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
          <div style='background-color: #8B6F5B; color: white; padding: 20px; text-align: center;'>
            <h1>Pet Paradise - Administration</h1>
            <h2>Nouvelle demande de réservation</h2>
          </div>
          
          <div style='padding: 20px;'>
            <p>Une nouvelle demande de réservation a été reçue :</p>
            
            <div style='background-color: #F9F5EF; padding: 15px; border-radius: 5px; margin: 20px 0;'>
              <h3>Informations client :</h3>
              <ul>
                <li><strong>Nom :</strong> " . htmlspecialchars($firstName) . " " . htmlspecialchars($lastName) . "</li>
                <li><strong>Email :</strong> " . htmlspecialchars($email) . "</li>
                <li><strong>Téléphone :</strong> " . htmlspecialchars($phone) . "</li>
                <li><strong>Adresse :</strong> " . htmlspecialchars($address) . "</li>
              </ul>
            </div>
            
            <div style='background-color: #F0EAE2; padding: 15px; border-radius: 5px; margin: 20px 0;'>
              <h3>Détails du séjour :</h3>
              <ul>
                <li><strong>Dates :</strong> Du " . htmlspecialchars($startDate) . " au " . htmlspecialchars($endDate) . "</li>
                <li><strong>Nombre d'animaux :</strong> " . $numberOfAnimals . "</li>
                <li><strong>Animaux :</strong> " . $animalsList . "</li>
              </ul>
            </div>
            
            <p><strong>Action requise :</strong> Veuillez traiter cette demande dans l'interface d'administration.</p>
            
            <div style='text-align: center; margin-top: 30px;'>
              <a href='" . ($_ENV['BASE_URL'] ?? 'http://localhost:3000') . "/paradise-management/reservations' 
                 style='background-color: #8B6F5B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                Accéder à l'administration
              </a>
            </div>
          </div>
        </div>";
    }
}
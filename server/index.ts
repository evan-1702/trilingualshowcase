import express, { type Request, Response, NextFunction } from "express";
import { spawn } from "child_process";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Express middlewares MUST come first
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Start PHP server on port 8080
log("Starting PHP 8.3 server...");
const phpServer = spawn("php", ["-S", "127.0.0.1:8080", "-t", "api/", "api/server.php"], {
  stdio: ['pipe', 'pipe', 'pipe']
});

phpServer.stdout.on('data', (data) => {
  log(`PHP: ${data.toString().trim()}`);
});

phpServer.stderr.on('data', (data) => {
  log(`PHP Error: ${data.toString().trim()}`);
});

// Proxy all API requests to PHP server
app.use('/api', async (req: Request, res: Response) => {
  try {
    const url = `http://127.0.0.1:8080/api${req.path}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Forward cookies for session management
    if (req.headers.cookie) {
      headers['Cookie'] = req.headers.cookie;
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      let body = '';
      if (req.body) {
        body = JSON.stringify(req.body);
      } else {
        // For raw body data
        const chunks: Buffer[] = [];
        req.on('data', (chunk) => chunks.push(chunk));
        await new Promise(resolve => req.on('end', resolve));
        body = Buffer.concat(chunks).toString();
      }
      fetchOptions.body = body;
    }

    log(`Proxying ${req.method} ${req.path} to PHP server`);
    
    const response = await fetch(url, fetchOptions);
    const data = await response.text();
    
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    
    // Forward Set-Cookie headers for session management
    const setCookie = response.headers.get('Set-Cookie');
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }
    
    res.send(data);
  } catch (error) {
    log(`Proxy error: ${error}`);
    res.status(500).json({ error: 'PHP server connection failed' });
  }
});



(async () => {
  const server = createServer(app);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  const PORT = Number(process.env.PORT) || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`Node.js proxy on port ${PORT} -> PHP API on port 8080`);
  });

  process.on('SIGTERM', () => {
    phpServer.kill();
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    phpServer.kill();
    process.exit(0);
  });
})();
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { validateContactPayload, checkRateLimit } from './src/utils/portfolioLogic';

dotenv.config();

interface StoredContactSubmission {
  protocol: string;
  name: string;
  email: string;
  serviceType: string;
  description: string;
  createdAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'contact_submissions.json');
const rateLimitMap = new Map<string, number[]>();

function readSubmissions(): StoredContactSubmission[] {
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSubmission(entry: StoredContactSubmission): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const existing = readSubmissions();
    existing.unshift(entry);
    // Keep latest 200 entries
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(existing.slice(0, 200), null, 2), 'utf-8');
  } catch {
    // Fallback if filesystem is read-only
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  // Health & API status
  app.get('/api/health', (_req, res) => {
    const submissions = readSubmissions();
    res.json({
      status: 'ok',
      totalRequestsRecorded: submissions.length,
    });
  });

  // Real Contact Submission Endpoint with Server-Side Validation & Rate Limiting
  app.post('/api/contact', async (req, res) => {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown-client';

    const rateStatus = checkRateLimit(rateLimitMap, clientIp, Date.now(), 60_000, 6);
    if (!rateStatus.allowed) {
      res.status(429).json({
        ok: false,
        message: `Muitas solicitações recentes. Aguarde ${rateStatus.retryAfterSeconds}s antes de enviar novamente.`,
      });
      return;
    }

    const validation = validateContactPayload(req.body || {});
    if (!validation.valid) {
      res.status(400).json({
        ok: false,
        message: 'Verifique os campos destacados no formulário.',
        errors: validation.errors,
      });
      return;
    }

    const protocol = `ATD-${new Date().getFullYear()}-${crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const record: StoredContactSubmission = {
      protocol,
      ...validation.sanitized,
      createdAt,
    };

    saveSubmission(record);

    // Optional external webhook forwarding if configured via environment variable
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl && /^https?:\/\//i.test(webhookUrl)) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
      } catch {
        // Non-blocking webhook notification
      }
    }

    res.status(201).json({
      ok: true,
      protocol,
      createdAt,
      summary: {
        name: record.name,
        serviceType: record.serviceType,
      },
      message:
        'Solicitação registrada com sucesso no servidor. Utilize o protocolo gerado para acompanhamento ou inicie conversa imediata via WhatsApp.',
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

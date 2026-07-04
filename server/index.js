/**
 * FinBiz contact API — Nodemailer + Gmail App Password
 *
 * Required in server/.env:
 *   EMAIL_USER=kumarakash030528@gmail.com
 *   EMAIL_PASS=your_gmail_app_password
 *   OWNER_EMAIL=kumarakash030528@gmail.com
 */

require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { stripControlChars } = require('./lib/sanitize');
const { verifyMailer, isMailConfigured, sendInquiryEmails } = require('./lib/mailer');

const PORT = Number(process.env.PORT) || 3001;
const OWNER_EMAIL = (process.env.OWNER_EMAIL || 'kumarakash030528@gmail.com').trim();
const DATA_FILE = path.join(__dirname, 'data', 'inquiries.json');
const WEBSITE_ROOT = path.join(__dirname, '..');

const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const app = express();

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (corsOrigins.length === 0) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS']
  })
);

app.use(express.json({ limit: '48kb' }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, emailed: false, message: 'Too many submissions. Please try again later.' }
});

async function appendInquiry(record) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  let existing = [];
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    existing = JSON.parse(raw);
    if (!Array.isArray(existing)) existing = [];
  } catch {
    existing = [];
  }
  existing.push(record);
  await fs.writeFile(DATA_FILE, JSON.stringify(existing, null, 2), 'utf8');
}

const validators = [
  body('fullName')
    .trim()
    .customSanitizer(stripControlChars)
    .isLength({ min: 2, max: 120 })
    .withMessage('Please enter a valid full name.'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address.'),
  body('phone')
    .trim()
    .customSanitizer(stripControlChars)
    .isLength({ min: 10, max: 24 })
    .withMessage('Please enter a valid phone number.'),
  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .customSanitizer(stripControlChars)
    .isLength({ max: 160 }),
  body('serviceType')
    .trim()
    .customSanitizer(stripControlChars)
    .isLength({ min: 2, max: 64 })
    .withMessage('Please select a service type.'),
  body('budgetRange')
    .trim()
    .customSanitizer(stripControlChars)
    .isLength({ min: 3, max: 48 })
    .withMessage('Please select a budget range.'),
  body('deadline')
    .optional({ checkFalsy: true })
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Invalid deadline date.'),
  body('message')
    .trim()
    .customSanitizer(stripControlChars)
    .isLength({ min: 10, max: 5000 })
    .withMessage('Please describe your project (at least 10 characters).'),
  body('serviceTypeLabel').optional().trim().customSanitizer(stripControlChars),
  body('budgetLabel').optional().trim().customSanitizer(stripControlChars),
  body('receivedAt').optional().trim()
];

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    mailConfigured: isMailConfigured(),
    ownerEmail: OWNER_EMAIL
  });
});

app.get('/api/contact/status', (_req, res) => {
  const { user, pass } = require('./lib/mailer').getEmailCredentials();
  let reason = 'ready';
  if (!user) reason = 'EMAIL_USER_MISSING';
  else if (!pass) reason = 'EMAIL_PASS_EMPTY';
  else reason = 'CREDENTIALS_SET';

  res.json({
    ok: true,
    mailConfigured: isMailConfigured(),
    ownerEmail: OWNER_EMAIL,
    reason,
    message:
      reason === 'EMAIL_PASS_EMPTY'
        ? 'EMAIL_PASS is empty in server/.env — run server/setup-email.ps1 or paste your Gmail App Password there.'
        : reason === 'EMAIL_USER_MISSING'
          ? 'EMAIL_USER is missing in server/.env'
          : isMailConfigured()
            ? 'Email delivery is ready.'
            : 'Email not configured.'
  });
});

app.get('/api/inquiries', async (_req, res) => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const inquiries = JSON.parse(raw);
    res.json({ ok: true, inquiries: Array.isArray(inquiries) ? inquiries : [] });
  } catch {
    res.json({ ok: true, inquiries: [] });
  }
});

app.post('/api/contact', contactLimiter, validators, async (req, res) => {
  const honeypot = req.body.website || req.body._gotcha || req.body.url;
  if (honeypot) {
    console.warn('[finbiz-contact] Honeypot triggered');
    return res.status(400).json({ ok: false, emailed: false, message: 'Invalid submission.' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    return res.status(400).json({
      ok: false,
      emailed: false,
      message: first.msg || 'Validation failed.'
    });
  }

  if (!isMailConfigured()) {
    console.error('[finbiz-contact] Rejected — EMAIL_USER / EMAIL_PASS missing');
    return res.status(503).json({
      ok: false,
      emailed: false,
      message:
        'Email service is not configured on the server. Please contact us on WhatsApp or email directly.'
    });
  }

  const {
    fullName,
    email,
    phone,
    company,
    serviceType,
    budgetRange,
    deadline,
    message,
    receivedAt,
    serviceTypeLabel,
    budgetLabel
  } = req.body;

  const inquiry = {
    fullName,
    email,
    phone,
    company: company || null,
    serviceType,
    serviceTypeLabel: serviceTypeLabel || serviceType,
    budgetRange,
    budgetLabel: budgetLabel || budgetRange,
    deadline: deadline || null,
    message,
    receivedAt: receivedAt || new Date().toISOString()
  };

  try {
    const mailResult = await sendInquiryEmails({
      ownerEmail: OWNER_EMAIL,
      inquiry
    });

    const stored = {
      ...inquiry,
      storedAt: new Date().toISOString(),
      mailResult
    };
    await appendInquiry(stored);

    console.log('[finbiz-contact] Success — emails delivered for', email);

    return res.json({
      ok: true,
      emailed: true,
      delivery: 'nodemailer',
      message:
        'Your request was sent successfully! A confirmation email has been sent to your inbox.'
    });
  } catch (err) {
    console.error('[finbiz-contact] Email delivery failed:', err.message);
    if (err.response) console.error('[finbiz-contact] SMTP response:', err.response);

    return res.status(500).json({
      ok: false,
      emailed: false,
      message:
        'We could not send your request right now. Please try again in a few minutes, or contact us on WhatsApp.'
    });
  }
});

app.use(express.static(WEBSITE_ROOT));

async function start() {
  const mailOk = await verifyMailer();

  app.listen(PORT, () => {
    console.log(`[finbiz] Website + API: http://localhost:${PORT}`);
    console.log(`[finbiz] POST /api/contact → ${OWNER_EMAIL}`);
    if (!mailOk) {
      console.log('[finbiz] ⚠️  Create server/.env with EMAIL_USER and EMAIL_PASS (Gmail App Password)');
      console.log('[finbiz]     See server/.env.example');
    }
  });
}

start().catch((err) => {
  console.error('[finbiz] Failed to start:', err);
  process.exit(1);
});

const nodemailer = require('nodemailer');
const {
  adminInquiryEmail,
  customerConfirmationEmail,
  adminInquiryText,
  customerConfirmationText
} = require('./emailTemplates');

let transporter = null;
let configured = false;

function getEmailCredentials() {
  const user = (process.env.EMAIL_USER || process.env.SMTP_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').trim();
  return { user, pass };
}

function buildTransporter() {
  const { user, pass } = getEmailCredentials();
  if (!user || !pass) {
    configured = false;
    transporter = null;
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE) === 'true',
    auth: { user, pass },
    tls: { rejectUnauthorized: true }
  });

  configured = true;
  return transporter;
}

async function verifyMailer() {
  const t = buildTransporter();
  if (!t) {
    console.warn(
      '[finbiz-mail] EMAIL_USER / EMAIL_PASS not set — copy server/.env.example to server/.env and add Gmail App Password.'
    );
    return false;
  }
  try {
    await t.verify();
    console.log('[finbiz-mail] Gmail SMTP ready →', getEmailCredentials().user);
    return true;
  } catch (err) {
    configured = false;
    console.error('[finbiz-mail] SMTP verify failed:', err.message);
    return false;
  }
}

function isMailConfigured() {
  const { user, pass } = getEmailCredentials();
  return Boolean(user && pass);
}

function getFromAddress() {
  const { user } = getEmailCredentials();
  return (
    process.env.EMAIL_FROM ||
    process.env.SMTP_FROM ||
    `"FinBiz Solutions" <${user}>`
  );
}

async function sendInquiryEmails({ ownerEmail, inquiry }) {
  if (!transporter || !configured) {
    buildTransporter();
  }
  if (!transporter) {
    throw new Error(
      'Email service is not configured. Add EMAIL_USER and EMAIL_PASS to server/.env (Gmail App Password).'
    );
  }

  const from = getFromAddress();
  const adminSubject = '🚀 New Project Inquiry Received';
  const customerSubject = '✓ our Request Has Been Sent Successfully | FinBiz Solutions';

  console.log('[finbiz-mail] Sending admin notification →', ownerEmail);
  const adminResult = await transporter.sendMail({
    from,
    to: ownerEmail,
    replyTo: inquiry.email,
    subject: adminSubject,
    text: adminInquiryText(inquiry),
    html: adminInquiryEmail(inquiry)
  });
  console.log('[finbiz-mail] Admin email sent:', adminResult.messageId);

  console.log('[finbiz-mail] Sending customer confirmation →', inquiry.email);
  const customerResult = await transporter.sendMail({
    from,
    to: inquiry.email,
    subject: customerSubject,
    text: customerConfirmationText(inquiry),
    html: customerConfirmationEmail(inquiry)
  });
  console.log('[finbiz-mail] Customer email sent:', customerResult.messageId);

  return {
    adminMessageId: adminResult.messageId,
    customerMessageId: customerResult.messageId
  };
}

module.exports = {
  verifyMailer,
  isMailConfigured,
  sendInquiryEmails,
  getEmailCredentials
};

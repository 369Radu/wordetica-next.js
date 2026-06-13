import { Router } from 'express';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { detail: 'Too many messages sent. Please wait 15 minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function buildTransport() {
  const { smtpHost, smtpPort, smtpUser, smtpPass } = config;
  if (!smtpHost || !smtpUser || !smtpPass) return null;

  return nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort) || 587,
    secure: Number(smtpPort) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

router.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ detail: 'Name, email and message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ detail: 'Invalid email address.' });
  }

  const transport = buildTransport();
  if (!transport) {
    console.error('[contact] SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS in .env');
    return res.status(503).json({ detail: 'Email service not configured.' });
  }

  const subjectLine = subject?.trim()
    ? `[Wordetica Contact] ${subject.trim()}`
    : `[Wordetica Contact] Message from ${name.trim()}`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
      <h2 style="color:#1a6b5a;border-bottom:2px solid #e8f5f0;padding-bottom:12px">
        New contact message — Wordetica
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr>
          <td style="padding:8px 0;font-weight:700;width:100px;color:#555">Name</td>
          <td style="padding:8px 0">${escHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:700;color:#555">Email</td>
          <td style="padding:8px 0"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td>
        </tr>
        ${subject?.trim() ? `
        <tr>
          <td style="padding:8px 0;font-weight:700;color:#555">Subject</td>
          <td style="padding:8px 0">${escHtml(subject)}</td>
        </tr>` : ''}
      </table>
      <h3 style="color:#1a6b5a;margin-bottom:8px">Message</h3>
      <div style="background:#f9fffe;border:1px solid #d0ede6;border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.6">
        ${escHtml(message)}
      </div>
      <p style="margin-top:32px;font-size:12px;color:#999">
        Sent via the contact form at wordetica.eu · Reply directly to this email to respond to ${escHtml(name)}.
      </p>
    </div>
  `;

  try {
    await transport.sendMail({
      from: `"Wordetica Contact" <${config.smtpUser}>`,
      to: 'office@wordetica.eu',
      replyTo: `"${name.trim()}" <${email.trim()}>`,
      subject: subjectLine,
      html,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    res.json({ detail: 'Message sent successfully.' });
  } catch (err) {
    console.error('[contact] Failed to send email:', err.message);
    res.status(500).json({ detail: 'Failed to send your message. Please try again or email us directly.' });
  }
});

function escHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default router;

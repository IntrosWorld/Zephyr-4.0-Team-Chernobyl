const nodemailer = require("nodemailer");

let _transporter = null;
let _warned = false;

// Returns null (and logs once) when SMTP isn't configured, so callers can
// no-op instead of crashing — same "optional" pattern as GITHUB_TOKEN.
function getTransporter() {
  if (!process.env.SMTP_HOST) {
    if (!_warned) {
      console.warn("⚠️  SMTP_HOST not set — email alerts are disabled.");
      _warned = true;
    }
    return null;
  }

  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return _transporter;
}

async function sendMail({ to, subject, text }) {
  const transporter = getTransporter();
  if (!transporter || !to) return;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}

module.exports = { sendMail };

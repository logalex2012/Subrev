import nodemailer from 'nodemailer';
import {
  badRequest,
  normalizeEmail,
  ok,
  readJson,
  serverError,
  generateOtp,
  sha256,
  signToken,
} from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end('Method Not Allowed');
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return badRequest(res, 'Invalid JSON');
  }

  const email = normalizeEmail(body.email);
  if (!email || !email.includes('@') || email.length > 320) {
    return badRequest(res, 'Invalid email');
  }

  const secret = process.env.OTP_SECRET;
  if (!secret) return serverError(res, 'Missing OTP_SECRET');

  const otp = generateOtp();
  const expiresInSec = 10 * 60;
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;

  const token = signToken(
    {
      email,
      exp,
      otpHash: sha256(`${email}:${otp}:${secret}`),
    },
    secret
  );

  const from = process.env.OTP_FROM || 'subrev.mail1409@mail.ru';
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return serverError(res, 'Missing SMTP_* env vars');
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: 'SubreV — код подтверждения',
      text: `Ваш код подтверждения SubreV: ${otp}\n\nОн действует 10 минут.`,
    });
  } catch (e) {
    return serverError(res, 'Failed to send email');
  }

  return ok(res, { token, expiresInSec });
}


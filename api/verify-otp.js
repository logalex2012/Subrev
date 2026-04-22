import {
  badRequest,
  normalizeEmail,
  ok,
  readJson,
  serverError,
  sha256,
  verifyToken,
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

  const secret = process.env.OTP_SECRET;
  if (!secret) return serverError(res, 'Missing OTP_SECRET');

  const email = normalizeEmail(body.email);
  const otp = String(body.otp ?? '').trim();
  const token = String(body.token ?? '').trim();

  if (!email || !otp || otp.length !== 6 || !/^\d{6}$/.test(otp) || !token) {
    return badRequest(res, 'Invalid payload');
  }

  const payload = verifyToken(token, secret);
  if (!payload || payload.email !== email) return badRequest(res, 'Invalid token');
  if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
    return badRequest(res, 'OTP expired');
  }

  const expectedHash = sha256(`${email}:${otp}:${secret}`);
  if (payload.otpHash !== expectedHash) return badRequest(res, 'Invalid OTP');

  // Issue a short "session" token for the client (still stateless; no DB yet)
  const userId = sha256(`user:${email}:${secret}`).slice(0, 24);
  const session = signToken(
    { userId, email, exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 },
    secret
  );

  return ok(res, { userId, email, session });
}


import crypto from 'node:crypto';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export function badRequest(res, message) {
  return json(res, 400, { ok: false, error: message });
}

export function serverError(res, message = 'Server error') {
  return json(res, 500, { ok: false, error: message });
}

export function ok(res, body = {}) {
  return json(res, 200, { ok: true, ...body });
}

export function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

export function generateOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

export function sha256(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex');
}

export function signToken(payload, secret) {
  const enc = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const header = { alg: 'HS256', typ: 'JWT' };
  const h = enc(header);
  const p = enc(payload);
  const sig = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  return `${h}.${p}.${sig}`;
}

export function verifyToken(token, secret) {
  try {
    const [h, p, sig] = String(token ?? '').split('.');
    if (!h || !p || !sig) return null;
    const expSig = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expSig))) return null;
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
    return payload && typeof payload === 'object' ? payload : null;
  } catch {
    return null;
  }
}


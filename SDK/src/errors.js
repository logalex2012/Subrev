export class SDKError extends Error {
  constructor(message, { cause, code } = {}) {
    super(message);
    this.name = 'SDKError';
    this.cause = cause;
    this.code = code;
  }
}

export class NetworkError extends SDKError {
  constructor(message = 'Network error', opts = {}) {
    super(message, { ...opts, code: opts.code ?? 'NETWORK_ERROR' });
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends SDKError {
  constructor(message = 'Request timed out', opts = {}) {
    super(message, { ...opts, code: opts.code ?? 'TIMEOUT' });
    this.name = 'TimeoutError';
  }
}

export class HTTPError extends SDKError {
  constructor(message = 'HTTP error', { status, requestId, body, ...rest } = {}) {
    super(message, { ...rest, code: rest.code ?? 'HTTP_ERROR' });
    this.name = 'HTTPError';
    this.status = status;
    this.requestId = requestId;
    this.body = body;
  }
}


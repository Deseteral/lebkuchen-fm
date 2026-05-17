interface ClientErrorExtra {
  [key: string]: unknown;
}

interface ReportClientErrorPayload {
  context: string;
  message: string;
  stack?: string;
  timestamp: string;
  path: string;
  appVersion: string;
  extra?: ClientErrorExtra;
}

const DUPLICATE_REPORT_WINDOW_MS = 1000;

let lastReportedFingerprint: string | null = null;
let lastReportedAt = 0;

function normalizeError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      message: error.message || 'Unknown error',
      stack: error.stack,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return { message: 'Unknown error' };
}

function shouldSkipDuplicateReport(context: string, message: string): boolean {
  const now = Date.now();
  const fingerprint = `${context}:${message}`;

  if (
    lastReportedFingerprint === fingerprint &&
    now - lastReportedAt < DUPLICATE_REPORT_WINDOW_MS
  ) {
    return true;
  }

  lastReportedFingerprint = fingerprint;
  lastReportedAt = now;
  return false;
}

function reportClientError(context: string, error: unknown, extra?: ClientErrorExtra): void {
  const normalized = normalizeError(error);

  if (shouldSkipDuplicateReport(context, normalized.message)) {
    return;
  }

  const payload: ReportClientErrorPayload = {
    context,
    message: normalized.message,
    stack: normalized.stack,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    appVersion: __APP_VERSION__,
    extra,
  };

  console.error('[ClientError]', payload);
}

export { reportClientError };

/** One field's messages in a 400 VALIDATION_FAILED answer (common/filters/validation-exception.factory.ts). */
export interface FieldError {
  field: string;
  messages: string[];
}

/** The backend's error envelope: { success: false, error: { code, message, details }, meta: { requestId } }. */
export interface ErrorEnvelope {
  success: false;
  error: { code: string; message: string; details: unknown };
  meta: { requestId?: string };
}

/** A refused or failed API call, with the backend's own code and message. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: unknown = null,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** The first message for each field of a validation error, keyed by field name. */
  get fieldErrors(): Record<string, string> {
    if (!Array.isArray(this.details)) return {};
    const out: Record<string, string> = {};
    for (const item of this.details as FieldError[]) {
      if (item && typeof item.field === 'string' && Array.isArray(item.messages) && item.messages[0]) {
        out[item.field] = item.messages[0];
      }
    }
    return out;
  }
}

/** A readable message for any thrown value. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.code === 'VALIDATION_FAILED') {
    const fields = Object.values(error.fieldErrors);
    if (fields.length > 0) return fields.join('. ');
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

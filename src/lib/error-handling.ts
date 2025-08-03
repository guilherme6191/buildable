export function logError(
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>
): void {
  console.error(`Error in ${context}:`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...metadata,
  });
}

export function createError(message: string, cause?: unknown): Error {
  const error = new Error(message);
  if (cause instanceof Error) {
    error.cause = cause;
  }
  return error;
}

export function handleDatabaseError(
  operation: string,
  error: unknown,
  id?: string
): null {
  const metadata = id ? { id } : undefined;
  logError(`Database ${operation}`, error, metadata);
  return null;
}

export function isNotFoundError(error: { code?: string }): boolean {
  return error.code === "PGRST116";
}

export function isInvalidUUIDError(error: { code?: string }): boolean {
  return error.code === "22P02";
}

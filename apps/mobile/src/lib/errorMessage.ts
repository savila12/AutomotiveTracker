export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    const maybeError = error as { message?: string; details?: string; hint?: string };
    return maybeError.message || maybeError.details || maybeError.hint || 'Please try again.';
  }

  return 'Please try again.';
};
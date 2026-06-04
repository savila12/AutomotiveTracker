export const getAuthErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : 'Please try again.';
};

export function ActionResponseBuilder<T>() {
  return {
    success: (data: T) => ({
      status: 'success',
      data,
    }),
    error: (message: string) => ({
      status: 'error',
      message,
    }),
  };
}

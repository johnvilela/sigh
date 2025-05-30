export function actionResponseBuilder<T> () {
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

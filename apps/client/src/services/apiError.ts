export const ApiError = (status: number, message?: string) => {
  const err = new Error(message || `API Error ${status}`) as Error & { status: number };
  err.status = status;
  return err;
};

export type ApiErrorShape = { status: number; message?: string };

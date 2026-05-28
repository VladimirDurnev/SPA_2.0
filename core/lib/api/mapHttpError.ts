import axios from 'axios';

export function mapHttpError(error: unknown, fallback = 'Ошибка запроса'): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message ?? error.message ?? fallback;
  }
  if (error instanceof Error)
    return error.message;
  return fallback;
}

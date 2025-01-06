import { retry } from './retry';

export async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  return retry(operation, {
    retries: 3,
    minTimeout: 1000,
    maxTimeout: 5000,
    onRetry: (error, attempt) => {
      console.warn(`Retrying operation (attempt ${attempt}):`, error);
    }
  });
}
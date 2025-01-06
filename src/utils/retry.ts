interface RetryOptions {
  retries: number;
  minTimeout: number;
  maxTimeout: number;
  onRetry?: (error: any, attempt: number) => void;
}

export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= options.retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === options.retries) {
        break;
      }

      if (options.onRetry) {
        options.onRetry(error, attempt);
      }

      const timeout = Math.min(
        Math.random() * options.maxTimeout,
        options.minTimeout * Math.pow(2, attempt)
      );
      
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }

  throw lastError;
}
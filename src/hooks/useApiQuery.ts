import { useState, useEffect, useCallback } from "react";

interface UseApiQueryOptions<T> {
  /** If false, the query won't execute automatically */
  enabled?: boolean;
  /** Initial data to use before the API responds */
  initialData?: T;
}

interface UseApiQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Lightweight data-fetching hook with loading/error states.
 * Wraps any async function that returns data.
 */
export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseApiQueryOptions<T> = {}
): UseApiQueryResult<T> {
  const { enabled = true, initialData } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (enabled) fetch();
  }, [fetch, enabled]);

  return { data, isLoading, error, refetch: fetch };
}

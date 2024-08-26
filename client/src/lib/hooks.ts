import { useCallback, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLoader<TLoader extends (...args: any) => Promise<any>>(
  loader: TLoader
): {
  loading: boolean;
  data: Awaited<ReturnType<typeof loader>> | undefined;
  error: unknown;
  load: (...args: Parameters<TLoader>) => void;
} {
  const [data, setData] = useState<
    Awaited<ReturnType<typeof loader>> | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(
    async (...args: Parameters<TLoader>) => {
      setLoading(true);
      setData(undefined);
      setError(null);

      try {
        const res = await loader(...args);
        setData(res);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [loader]
  );

  return { data, loading, error, load };
}

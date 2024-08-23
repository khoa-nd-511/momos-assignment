import { useEffect, useState } from "react";

export function useFetch<TLoader extends (...args: any) => Promise<any>>(
  loader: TLoader
): {
  loading: boolean;
  data: Awaited<ReturnType<typeof loader>> | undefined;
  error: any;
} {
  const [data, setData] = useState<
    Awaited<ReturnType<typeof loader>> | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setData(undefined);
    setError(null);

    loader()
      .then(setData)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

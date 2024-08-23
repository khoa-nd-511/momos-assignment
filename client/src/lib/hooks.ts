import { useState } from "react";

export function useLoader<TLoader extends (...args: any) => Promise<any>>(
  loader: TLoader
): {
  loading: boolean;
  data: Awaited<ReturnType<typeof loader>> | undefined;
  error: any;
  load: (...args: Parameters<TLoader>) => void;
} {
  const [data, setData] = useState<
    Awaited<ReturnType<typeof loader>> | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = (...args: Parameters<TLoader>) => {
    setLoading(true);
    setData(undefined);
    setError(null);

    loader(...args)
      .then(setData)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, error, load };
}

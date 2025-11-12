type Runner<T> = () => Promise<T>;

function withTimeout<T>(p: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

export async function withMock<T>(
  run: Runner<T>,
  mock: T,
  opts?: {
    useMock?: boolean;
    timeoutMs?: number;
    onFallback?: (e: unknown) => void;
  }
): Promise<T> {
  const useMock = opts?.useMock ?? import.meta.env.VITE_USE_MOCKS === "true";
  const timeoutMs = opts?.timeoutMs ?? 8000;
  if (useMock) return mock;
  try {
    return await withTimeout(run(), timeoutMs);
  } catch (e) {
    opts?.onFallback?.(e);
    return mock;
  }
}

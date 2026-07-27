export const waitForTimeout = (
  durationMs: number,
  signal?: AbortSignal
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort);
      resolve();
    }, durationMs);

    const handleAbort = () => {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener('abort', handleAbort);
      reject(new DOMException('Request aborted', 'AbortError'));
    };

    if (signal?.aborted) {
      handleAbort();
      return;
    }

    signal?.addEventListener('abort', handleAbort);
  });

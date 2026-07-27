export const isPromiseLike = <TValue>(
  value: TValue | Promise<TValue>
): value is Promise<TValue> => {
  return value instanceof Promise;
};

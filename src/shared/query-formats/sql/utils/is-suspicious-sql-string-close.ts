export const isSuspiciousSqlStringClose = (
  input: string,
  quoteIndex: number
): boolean => {
  const nextChar = input[quoteIndex + 1];

  if (!nextChar) {
    return false;
  }

  return !/[\s,)=<>!]/.test(nextChar);
};

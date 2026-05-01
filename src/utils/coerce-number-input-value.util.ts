export const coerceNumberInputValue = (value: string): number | string => {
  if (value.trim() === '') {
    return '';
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : value;
};

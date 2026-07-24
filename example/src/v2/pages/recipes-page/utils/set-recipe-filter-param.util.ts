export const setRecipeFilterParam = (
  current: URLSearchParams,
  value: string | null
): URLSearchParams => {
  const next = new URLSearchParams(current);
  if (value === null) next.delete('filter');
  else next.set('filter', value);
  return next;
};

export const getSelectedOptions = (
  values: Array<{ value: string; label: string }>,
  selectedValue: string[]
) => {
  return selectedValue
    .map((value) => values.find((item) => item.value === value))
    .filter(Boolean) as Array<{ value: string; label: string }>;
};

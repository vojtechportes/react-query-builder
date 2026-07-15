const isoCalendarDatePattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

export const compareRecipeValues = (left: unknown, right: unknown): number => {
  if (
    typeof left === 'string' &&
    typeof right === 'string' &&
    isoCalendarDatePattern.test(left) &&
    isoCalendarDatePattern.test(right)
  ) {
    const leftTimestamp = Date.parse(`${left}T00:00:00Z`);
    const rightTimestamp = Date.parse(`${right}T00:00:00Z`);
    const leftIsValid =
      Number.isFinite(leftTimestamp) &&
      new Date(leftTimestamp).toISOString().slice(0, 10) === left;
    const rightIsValid =
      Number.isFinite(rightTimestamp) &&
      new Date(rightTimestamp).toISOString().slice(0, 10) === right;

    if (leftIsValid && rightIsValid) return left.localeCompare(right);
  }

  const leftNumber = Number(left);
  const rightNumber = Number(right);

  if (Number.isNaN(leftNumber) || Number.isNaN(rightNumber)) return Number.NaN;
  if (leftNumber === rightNumber) return 0;
  return leftNumber < rightNumber ? -1 : 1;
};

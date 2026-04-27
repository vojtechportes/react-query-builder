export const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `rqb-${Math.random().toString(36).slice(2, 11)}`;
};

import type { DenormalizedQuery } from '@vojtechportes/react-query-builder';

export const generateAiDraft = (prompt: string): DenormalizedQuery => {
  const normalized = prompt.trim().toLocaleLowerCase();
  if (!normalized) throw new Error('Describe the filter you want to create.');

  if (normalized.includes('paid') && normalized.match(/\d+/)) {
    const amount = Number(normalized.match(/\d+/)?.[0]);
    return [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [
          { field: 'status', operator: 'EQUAL', value: 'PAID' },
          { field: 'total', operator: 'LARGER_EQUAL', value: amount },
        ],
      },
    ];
  }
  if (normalized.includes('pending')) {
    return [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'status', operator: 'EQUAL', value: 'PENDING' }],
      },
    ];
  }
  if (normalized.includes('refunded')) {
    return [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        children: [{ field: 'status', operator: 'EQUAL', value: 'REFUNDED' }],
      },
    ];
  }

  throw new Error(
    'This deterministic demo understands "paid over 100", "pending", or "refunded".'
  );
};

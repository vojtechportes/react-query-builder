import { describe, expect, it } from 'vitest';
import { generateAiDraft } from './generate-ai-draft.util';
import { validateAiDraft } from './validate-ai-draft.util';

describe('AI draft utilities', () => {
  it('generates and validates documented deterministic prompts', () => {
    const draft = generateAiDraft('Paid orders over 250');
    expect(validateAiDraft(draft)).toEqual(draft);
  });

  it('rejects unknown prompts and unauthorized draft fields', () => {
    expect(() => generateAiDraft('Delete every order')).toThrow(
      'deterministic demo'
    );
    expect(() =>
      validateAiDraft([
        {
          type: 'GROUP',
          value: 'AND',
          isNegated: false,
          children: [{ field: 'tenantId', operator: 'EQUAL', value: 'secret' }],
        },
      ])
    ).toThrow('schema');
  });
});

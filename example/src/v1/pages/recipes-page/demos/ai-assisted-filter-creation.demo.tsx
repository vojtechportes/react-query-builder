import * as React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDataTable } from '../components/recipe-data-table';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { recipeDemoRows } from '../constants/recipe-demo-rows';
import { cloneRecipeQuery } from '../utils/clone-recipe-query.util';
import { doesRecipeRowMatch } from '../utils/does-recipe-row-match.util';
import { generateAiDraft } from '../utils/generate-ai-draft.util';
import { validateAiDraft } from '../utils/validate-ai-draft.util';

const fields: IBuilderFieldProps[] = [
  {
    field: 'status',
    label: 'Status',
    type: 'LIST',
    value: [
      { label: 'Paid', value: 'PAID' },
      { label: 'Pending', value: 'PENDING' },
      { label: 'Refunded', value: 'REFUNDED' },
    ],
    operators: ['EQUAL', 'NOT_EQUAL'],
  },
  {
    field: 'total',
    label: 'Total',
    type: 'NUMBER',
    operators: ['EQUAL', 'LARGER_EQUAL', 'SMALLER_EQUAL'],
  },
];
const initialQuery: DenormalizedQuery = [
  {
    type: 'GROUP',
    value: 'AND',
    isNegated: false,
    children: [{ field: 'status', operator: 'EQUAL', value: 'PENDING' }],
  },
];

export const AiAssistedFilterCreationDemo: React.FC = () => {
  const [prompt, setPrompt] = React.useState('Paid orders over 100');
  const [applied, setApplied] = React.useState(() =>
    cloneRecipeQuery(initialQuery)
  );
  const [draft, setDraft] = React.useState<DenormalizedQuery | null>(null);
  const [message, setMessage] = React.useState(
    'Generate a draft; it will not apply automatically.'
  );
  const [error, setError] = React.useState(false);
  const rows = React.useMemo(
    () => recipeDemoRows.filter((row) => doesRecipeRowMatch(row, applied)),
    [applied]
  );

  const generate = () => {
    try {
      const nextDraft = validateAiDraft(generateAiDraft(prompt));
      setDraft(cloneRecipeQuery(nextDraft));
      setMessage('Draft validated. Review and confirm it before applying.');
      setError(false);
    } catch (nextError) {
      setDraft(null);
      setMessage(
        nextError instanceof Error
          ? nextError.message
          : 'Draft generation failed.'
      );
      setError(true);
    }
  };

  const confirm = () => {
    if (!draft) return;
    try {
      setApplied(cloneRecipeQuery(validateAiDraft(draft)));
      setDraft(null);
      setMessage('Filter applied. The results are updated.');
      setError(false);
    } catch (nextError) {
      setMessage(
        nextError instanceof Error
          ? nextError.message
          : 'Draft validation failed.'
      );
      setError(true);
    }
  };

  return (
    <RecipeDemoFrame
      title="AI-assisted draft review"
      kind="experimental"
      note="This simulation makes no network call. It creates an editable draft that changes results only after you confirm it."
      actions={
        <>
          <button type="button" onClick={generate}>
            Generate draft
          </button>
          <button type="button" onClick={confirm} disabled={!draft}>
            Confirm and apply
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(null);
              setMessage(
                'Draft cancelled. The applied filter and results were not changed.'
              );
            }}
            disabled={!draft}
          >
            Cancel draft
          </button>
        </>
      }
    >
      <RecipeDemoGroup>
        <label htmlFor="recipe-ai-prompt">Natural-language filter</label>
        <textarea
          id="recipe-ai-prompt"
          rows={3}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          style={{ maxWidth: '100%', padding: '0.6rem', font: 'inherit' }}
        />
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <p role={error ? 'alert' : 'status'}>{message}</p>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <RecipeBuilderSurface>
          <Builder
            fields={fields}
            data={draft ?? applied}
            onChange={draft ? setDraft : setApplied}
            showValidation
          />
        </RecipeBuilderSurface>
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <RecipeDataTable
          caption="Applied filter result"
          columns={[
            { field: 'name', label: 'Customer' },
            { field: 'status', label: 'Status' },
            { field: 'total', label: 'Total' },
            { field: 'country', label: 'Country' },
          ]}
          rows={rows}
        />
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default AiAssistedFilterCreationDemo;

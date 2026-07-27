import * as React from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import { RecipeBuilderSurface } from '../components/recipe-builder-surface';
import { RecipeDemoFrame } from '../components/recipe-demo-frame';
import { RecipeDemoGroup } from '../components/recipe-demo-group';
import { parseSqlWhereClause } from '../utils/parse-sql-where-clause.util';

const sampleSql = "WHERE status = 'PAID' AND total >= 100";
const initialParsed = parseSqlWhereClause(sampleSql);

export const SqlWhereToReactQueryBuilderDemo: React.FC = () => {
  const [sql, setSql] = React.useState(sampleSql);
  const [query, setQuery] = React.useState<DenormalizedQuery>(
    initialParsed.data
  );
  const [fields, setFields] = React.useState<IBuilderFieldProps[]>(
    initialParsed.fields
  );
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const parsed = parseSqlWhereClause(sql);
        setQuery(parsed.data);
        setFields(parsed.fields);
        setError(null);
      } catch (nextError) {
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Unable to parse SQL.'
        );
      }
    }, 200);

    return () => window.clearTimeout(timer);
  }, [sql]);

  return (
    <RecipeDemoFrame
      title="SQL WHERE import"
      note="SQL is parsed as you type. If it is invalid, the demo shows an error and keeps the last valid filter visible."
    >
      <RecipeDemoGroup>
        <label htmlFor="recipe-sql-input">SQL WHERE clause</label>
        <textarea
          id="recipe-sql-input"
          rows={3}
          value={sql}
          onChange={(event) => setSql(event.target.value)}
          style={{ maxWidth: '100%', padding: '0.6rem', font: 'inherit' }}
        />
        {error ? <p role="alert">{error}</p> : null}
      </RecipeDemoGroup>
      <RecipeDemoGroup>
        <RecipeBuilderSurface>
          <Builder
            fields={fields}
            data={query}
            onChange={setQuery}
            showValidation
          />
        </RecipeBuilderSurface>
      </RecipeDemoGroup>
    </RecipeDemoFrame>
  );
};

export default SqlWhereToReactQueryBuilderDemo;

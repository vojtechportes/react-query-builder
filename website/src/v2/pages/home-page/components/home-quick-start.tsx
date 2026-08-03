import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../../../../components/button';
import { CodeBlock } from '../../../../components/code-block';
import { Typography } from '../../../../components/typography/typography';

const Root = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
  gap: 2rem;
  align-items: start;
  padding: 2rem;
  border-radius: 16px;
  background: #0f172a;
  color: #e2e8f0;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled(Typography)`
  font-size: clamp(1.8rem, 3vw, 2.1rem);
  letter-spacing: -0.03em;
`;

const Description = styled(Typography)`
  color: #cbd5e1;
`;

const quickStartCode = `import { useState } from 'react';
import {
  Builder,
  type DenormalizedQuery,
  type IBuilderFieldProps,
} from '@vojtechportes/react-query-builder';
import '@vojtechportes/react-query-builder/styles.css';

const fields: IBuilderFieldProps[] = [
  { field: 'name', label: 'Product name', type: 'TEXT' },
  { field: 'price', label: 'Price', type: 'NUMBER' },
];

export const ProductFilter = () => {
  const [data, setData] = useState<DenormalizedQuery>([]);

  return <Builder fields={fields} data={data} onChange={setData} />;
};`;

export const HomeQuickStart: React.FC = () => (
  <Root aria-labelledby="home-quick-start-title">
    <div>
      <SectionTitle
        id="home-quick-start-title"
        variant="h2"
        color="light"
        mb={0.8}
      >
        Create a controlled builder
      </SectionTitle>
      <Description color="light" mb={1}>
        Define the fields your users can filter, keep query data in React state,
        and choose when to format or send the validated filter to your API.
      </Description>
      <Button
        color="white"
        component="a"
        size="small"
        to="/documentation/installation"
        variant="outlined"
      >
        Read the installation guide
      </Button>
    </div>
    <CodeBlock
      code={quickStartCode}
      language="tsx"
      label="React Query Builder TypeScript example"
    />
  </Root>
);

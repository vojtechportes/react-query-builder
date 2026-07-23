import * as React from 'react';
import styled from 'styled-components';
import { CodeBlock } from '../../../../components/code-block';
import { siteTheme } from '../../../../constants/site-theme';

const OutputCard = styled.section`
  display: grid;
  gap: 1rem;
`;

const SourceActions = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const SourceButton = styled.button`
  padding: 0.65rem 0.95rem;
  border: 1px solid ${siteTheme.primaryBorder};
  border-radius: 999px;
  background: ${siteTheme.primarySurface};
  color: ${siteTheme.primaryDark};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${siteTheme.primarySurfaceStrong};
  }
`;

export interface IDemoPlaygroundSourceProps {
  source: string;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

export const DemoPlaygroundSource: React.FC<IDemoPlaygroundSourceProps> = ({
  source,
  visible,
  onVisibleChange,
}) => (
  <OutputCard>
    <SourceActions>
      <SourceButton onClick={() => onVisibleChange(!visible)}>
        {visible ? 'Hide Builder source' : 'Show Builder source'}
      </SourceButton>
    </SourceActions>
    {visible ? (
      <CodeBlock code={source} label="Builder source" language="tsx" />
    ) : null}
  </OutputCard>
);

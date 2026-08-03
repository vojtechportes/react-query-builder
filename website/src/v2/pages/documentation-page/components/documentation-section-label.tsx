import styled from 'styled-components';
import { Typography } from '../../../../components/typography/typography';

export const DocumentationSectionLabel = styled(Typography).attrs({
  component: 'span',
  color: 'muted',
  fontSize: '0.8rem',
})`
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

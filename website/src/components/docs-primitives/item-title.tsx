import * as React from 'react';
import styled from 'styled-components';

const ItemTitleText = styled.span`
  display: inline;
  font-weight: 400;

  &::after {
    content: ' - ';
    color: #64748b;
  }
`;

const trimTrailingColon = (value: React.ReactNode): React.ReactNode => {
  if (typeof value === 'string') {
    return value.replace(/:\s*$/, '');
  }

  if (Array.isArray(value)) {
    const items = [...value];
    const lastIndex = items.length - 1;

    if (lastIndex >= 0) {
      items[lastIndex] = trimTrailingColon(items[lastIndex]);
    }

    return items;
  }

  return value;
};

export const ItemTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ItemTitleText>{trimTrailingColon(children)}</ItemTitleText>;

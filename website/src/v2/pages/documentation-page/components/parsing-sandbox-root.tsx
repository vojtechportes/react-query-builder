import styled from 'styled-components';

export const ParsingSandboxRoot = styled.section`
  display: grid;
  gap: 1.25rem;
  min-width: 0;
  padding: 1.5rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);

  @media (max-width: 540px) {
    padding: 1.25rem;
  }
`;

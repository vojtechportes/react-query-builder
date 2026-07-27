import styled from 'styled-components';

export const ContentArticle = styled.article`
  min-width: 0;
  padding: 2rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.08);

  @media (max-width: 540px) {
    padding: 1.25rem;
  }

  > * + * {
    margin-top: 1rem;
  }

  > p {
    margin: 0;
    color: #334155;
    line-height: 1.8;
  }
`;

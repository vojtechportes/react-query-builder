import * as React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSiteSearch } from '../hooks/use-site-search';
import { SearchIcon } from './icons';

const Root = styled.div`
  position: relative;
  width: 290px;
  flex: 0 0 auto;

  @media (max-width: 1180px) {
    width: 250px;
  }

  @media (max-width: 980px) {
    width: min(100%, 320px);
  }
`;

const SearchIconWrap = styled.span`
  position: absolute;
  top: 50%;
  left: 0.8rem;
  width: 18px;
  height: 18px;
  color: #64748b;
  transform: translateY(-50%);

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.78rem 1rem 0.78rem 2.5rem;
  border: 1px solid #dbe4f0;
  border-radius: 999px;
  background: #fff;
  color: #0f172a;
`;

const Results = styled.div`
  position: absolute;
  top: calc(100% + 0.55rem);
  right: 0;
  left: 0;
  overflow: hidden;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 22px 55px rgba(15, 23, 42, 0.15);
`;

const ResultButton = styled.button`
  width: 100%;
  padding: 0.95rem 1rem;
  border: 0;
  border-bottom: 1px solid #eef2f7;
  background: #fff;
  text-align: left;
  cursor: pointer;

  &:last-child {
    border-bottom: 0;
  }
`;

const ResultTitle = styled.div`
  font-weight: 700;
  color: #0f172a;
`;

const ResultSummary = styled.div`
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const HeaderSearch: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();
  const results = useSiteSearch(query);

  return (
    <Root>
      <SearchIconWrap>
        <SearchIcon />
      </SearchIconWrap>
      <Input
        type="search"
        placeholder="Search docs and pages"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />

      {query.trim() && results.length > 0 ? (
        <Results>
          {results.slice(0, 6).map(result => (
            <ResultButton
              key={result.id}
              onClick={() => {
                setQuery('');
                navigate(result.path);
              }}
            >
              <ResultTitle>{result.title}</ResultTitle>
              <ResultSummary>{result.summary}</ResultSummary>
            </ResultButton>
          ))}
        </Results>
      ) : null}
    </Root>
  );
};

import * as React from 'react';
import styled from 'styled-components';
import { Typography } from '../../../components/typography/typography';
import { SectionTitle } from '../../../components/docs-primitives';
import type { IRecipeFaq } from '../types/i-recipe-faq';

export interface IRecipeFaqProps {
  faqs: IRecipeFaq[];
}

const FaqList = styled.div`
  display: grid;
  gap: 1.25rem;
`;

export const RecipeFaq: React.FC<IRecipeFaqProps> = ({ faqs }) => (
  <section>
    <SectionTitle>Frequently asked questions</SectionTitle>
    <FaqList>
      {faqs.map((faq) => (
        <div key={faq.question}>
          <Typography variant="h3" as="body2" fontWeight={700} mb={0.4}>
            {faq.question}
          </Typography>
          <Typography color="muted">{faq.answer}</Typography>
        </div>
      ))}
    </FaqList>
  </section>
);

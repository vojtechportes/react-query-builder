import * as React from 'react';
import styled from 'styled-components';
import { SectionTitle } from '../../../../components/docs-primitives';
import type { IRecipeFaq } from '../types/recipe-faq';

export interface IRecipeFaqProps {
  faqs: IRecipeFaq[];
}

const FaqList = styled.div`
  display: grid;
  gap: 1.25rem;
`;

const FaqQuestion = styled.h3`
  margin: 0 0 0.4rem;
  font-size: 1rem;
  line-height: 1.4;
`;

const FaqAnswer = styled.p`
  margin: 0;
  line-height: 1.6;
`;

export const RecipeFaq: React.FC<IRecipeFaqProps> = ({ faqs }) => (
  <section>
    <SectionTitle>Frequently asked questions</SectionTitle>
    <FaqList>
      {faqs.map((faq) => (
        <div key={faq.question}>
          <FaqQuestion>{faq.question}</FaqQuestion>
          <FaqAnswer>{faq.answer}</FaqAnswer>
        </div>
      ))}
    </FaqList>
  </section>
);

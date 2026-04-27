import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from './button';
import { BuilderContextProvider } from './builder-context';
import { Component } from './component/component-container';
import { colors } from './constants/colors';
import { Strings, strings as defaultStrings } from './constants/strings';
import { Input } from './form/input';
import { Select } from './form/select';
import { SelectMulti } from './form/select-multi';
import { Switch } from './form/switch';
import { Group } from './group/group-container';
import { Option as GroupHeaderOption } from './group/option';
import { Iterator } from './iterator';
import { SecondaryButton } from './secondary-button';
import { Text } from './text';
import { emitQuery } from './utils/emit-query.util';
import { ingestQuery } from './utils/ingest-query.util';
import { isSameQuery } from './utils/is-same-query.util';
import {
  DenormalizedQuery,
  NormalizedQuery,
  QueryGroupValue,
  QueryOperator,
} from './utils/query-tree';

export const StyledBuilder = styled.div`
  padding: 1rem;
  background: #fff;
  border: 1px solid ${colors.light};
`;

export type BuilderFieldType =
  | 'BOOLEAN'
  | 'TEXT'
  | 'DATE'
  | 'NUMBER'
  | 'STATEMENT'
  | 'LIST'
  | 'MULTI_LIST'
  | 'GROUP';

export type BuilderFieldOperator = QueryOperator;

export type BuilderGroupValues = QueryGroupValue;

export type BuilderFieldValue =
  | string
  | string[]
  | boolean
  | Array<{ value: string | number; label: string }>;

export interface BuilderFieldProps {
  field: string;
  label: string;
  value?: BuilderFieldValue;
  type: BuilderFieldType;
  operators?: BuilderFieldOperator[];
}

export interface BuilderComponentsProps {
  form?: {
    Select?: any;
    SelectMulti?: any;
    Switch?: any;
    Input?: any;
  };
  Remove?: any;
  Add?: any;
  Component?: any;
  Group?: any;
  GroupHeaderOption?: any;
  Text?: any;
}

export interface BuilderProps {
  fields: BuilderFieldProps[];
  data: DenormalizedQuery;
  components?: BuilderComponentsProps;
  strings?: Strings;
  readOnly?: boolean;
  onChange?: (data: DenormalizedQuery) => any;
}

export const defaultComponents: BuilderComponentsProps = {
  form: {
    Input,
    Select,
    SelectMulti,
    Switch,
  },
  Remove: SecondaryButton,
  Add: Button,
  Component,
  Group,
  GroupHeaderOption,
  Text,
};

export const Builder: React.FC<BuilderProps> = ({
  data: originalData = [],
  fields,
  components = defaultComponents,
  strings = defaultStrings,
  readOnly = false,
  onChange,
}) => {
  const [data, setData] = useState<NormalizedQuery>(() =>
    ingestQuery(originalData)
  );
  const lastEmittedData = useRef<DenormalizedQuery | null>(null);
  const filteredData = data.filter(item => !item.parent);

  const handleChange = (nextData: NormalizedQuery) => {
    if (!onChange) {
      return;
    }

    try {
      const denormalizedData = emitQuery(nextData);
      lastEmittedData.current = denormalizedData;
      onChange(denormalizedData);
    } catch (error) {
      throw new Error('Input data tree is in invalid format');
    }
  };

  const updateData = (
    updater: (currentData: NormalizedQuery) => NormalizedQuery
  ) => {
    setData((currentData: NormalizedQuery) => {
      const nextData = updater(currentData);

      handleChange(nextData);

      return nextData;
    });
  };

  useEffect(() => {
    if (
      lastEmittedData.current &&
      isSameQuery(lastEmittedData.current, originalData)
    ) {
      lastEmittedData.current = null;
      return;
    }

    setData(ingestQuery(originalData));
  }, [originalData]);

  return (
    <BuilderContextProvider
      fields={fields}
      components={components}
      strings={strings}
      readOnly={readOnly}
      data={data}
      setData={setData}
      onChange={handleChange}
      updateData={updateData}
    >
      <StyledBuilder>
        <Iterator originalData={data} filteredData={filteredData} />
      </StyledBuilder>
    </BuilderContextProvider>
  );
};

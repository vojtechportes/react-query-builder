import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import uniqid from 'uniqid';
import { colors } from '../constants/colors';
import { Strings, strings as defaultStrings } from '../constants/strings';
import { assignIds } from '../utils/assignIds';
import { denormalizeTree } from '../utils/denormalizeTree';
import { normalizeTree } from '../utils/normalizeTree';
import { Button } from './Button';
import { Component } from './Component/Component';
import { BuilderContextProvider } from './Context';
import { Input } from './Form/Input';
import { Select } from './Form/Select';
import { SelectMulti } from './Form/SelectMulti';
import { Switch } from './Form/Switch';
import { Group } from './Group/Group';
import { Option as GroupHeaderOption } from './Group/Option';
import { Iterator } from './Iterator';
import { SecondaryButton } from './SecondaryButton';
import { Text } from './Text';

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

export type BuilderFieldOperator =
  | 'LARGER'
  | 'SMALLER'
  | 'LARGER_EQUAL'
  | 'SMALLER_EQUAL'
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'ALL_IN'
  | 'ANY_IN'
  | 'NOT_IN'
  | 'BETWEEN'
  | 'NOT_BETWEEN'
  | 'LIKE'
  | 'NOT_LIKE';

export type BuilderGroupValues = 'AND' | 'OR';

export interface BuilderFieldProps {
  field: string;
  label: string;
  value?:
    | string
    | string[]
    | boolean
    | Array<{ value: React.ReactText; label: string }>;
  type: BuilderFieldType;
  /* List of available operators */
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
  data: any;
  components?: BuilderComponentsProps;
  strings?: Strings;
  readOnly?: boolean;
  onChange?: (data: any) => any;
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
  data: originalData,
  fields,
  components = defaultComponents,
  strings = defaultStrings,
  readOnly = false,
  onChange,
}) => {
  let normalizedData: any;
  originalData = assignIds(originalData);

  if (originalData.length === 0) {
    originalData = [
      {
        type: 'GROUP',
        value: 'AND',
        isNegated: false,
        id: uniqid(),
        children: originalData,
      },
    ];
  }

  try {
    normalizedData = normalizeTree(originalData);
  } catch (e) {
    throw new Error('Input data tree is in invalid format');
  }

  const [data, setData] = useState(normalizedData);
  const filteredData = data.filter((item: any) => !item.parent);

  useEffect(() => {
    handleChange(normalizedData);
  }, []);

  const handleChange = (nextData: any) => {
    if (onChange) {
      try {
        onChange(denormalizeTree(nextData));
      } catch (e) {
        throw new Error('Input data tree is in invalid format');
      }
    }
  };

  return (
    <BuilderContextProvider
      fields={fields}
      components={components}
      strings={strings}
      readOnly={readOnly}
      data={data}
      setData={setData}
      onChange={handleChange}
    >
      <StyledBuilder>
        <Iterator originalData={data} filteredData={filteredData} />
      </StyledBuilder>
    </BuilderContextProvider>
  );
};

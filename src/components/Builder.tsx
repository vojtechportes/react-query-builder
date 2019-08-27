import React, { createContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Iterator } from './Iterator';
import { colors } from '../constants/colors';
import { normalizeTree } from '../utils/normalizeTree';
import { denormalizeTree } from '../utils/denormalizeTree';
import uniqid from 'uniqid';
import { assignIds } from '../utils/assignIds';

/* Configurable components */

import { Button } from './Button';
import { SecondaryButton } from './SecondaryButton';
import { Input } from './Form/Input';
import { Select } from './Form/Select';
import { SelectMulti } from './Form/SelectMulti';
import { Switch } from './Form/Switch';
import { Component } from './Component/Component';
import { Group } from './Group/Group';
import { Option as GroupHeaderOption } from './Group/Option';

/* Strings */

import { strings as defaultStrings, Strings } from '../constants/strings';

export const StyledBuilder = styled.div`
  padding: 1rem;
  border: 1px solid ${colors.light};
  background: #fff;
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
  | 'NOT_BETWEEN';

export type BuilderGroupValues = 'AND' | 'OR';

export interface BuilderFieldProps {
  field: string;
  label: string;
  value?:
    | string
    | string[]
    | boolean
    | { value: React.ReactText; label: string }[];
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
}

export interface BuilderProps {
  fields: BuilderFieldProps[];
  data: any;
  components?: BuilderComponentsProps;
  strings?: Strings;
  onChange?: (data: any) => any;
}

export interface BuilderContextProps {
  fields: BuilderFieldProps[];
  data: any;
  components: BuilderComponentsProps;
  strings: Strings;
  setData: React.Dispatch<any>;
  onChange: (data: any) => void;
}

export const BuilderContext = createContext<BuilderContextProps>(
  {} as BuilderContextProps
);

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
};

export const Builder: React.FC<BuilderProps> = ({
  data: originalData,
  fields,
  components = defaultComponents,
  strings = defaultStrings,
  onChange,
}) => {
  let normalizedData: any;
  originalData = assignIds(originalData);

  components = {
    ...defaultComponents,
    ...components,
    form: { ...defaultComponents.form, ...components.form },
  };

  strings = {
    ...defaultStrings,
    ...strings,
    component: {
      ...defaultStrings.component,
      ...strings.component,
    },
    form: {
      ...defaultStrings.form,
      ...strings.form,
    },
    group: {
      ...defaultStrings.group,
      ...strings.group,
    },
    operators: {
      ...defaultStrings.operators,
      ...strings.operators,
    },
  };

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
    <BuilderContext.Provider
      value={{
        fields,
        components,
        strings,
        data,
        setData,
        onChange: handleChange,
      }}
    >
      <StyledBuilder>
        <Iterator originalData={data} filteredData={filteredData} />
      </StyledBuilder>
    </BuilderContext.Provider>
  );
};

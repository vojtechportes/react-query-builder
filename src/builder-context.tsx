import React, { FC, createContext } from 'react';
import {
  IBuilderComponentsProps,
  IBuilderFieldProps,
  BuilderGroupMode,
  defaultComponents,
} from './builder';
import { IStrings, strings as defaultStrings } from './constants/strings';
import { NormalizedQuery } from './utils/query-tree';

export interface IBuilderContextProps {
  fields: IBuilderFieldProps[];
  data: NormalizedQuery;
  readOnly: boolean;
  draggable?: boolean;
  singleRootGroup?: boolean;
  groupTypes?: BuilderGroupMode;
  components: IBuilderComponentsProps;
  strings: IStrings;
  setData: React.Dispatch<NormalizedQuery>;
  onChange: (data: NormalizedQuery) => void;
  updateData?: (
    updater: (currentData: NormalizedQuery) => NormalizedQuery
  ) => void;
}

export const BuilderContext = createContext<IBuilderContextProps>(
  {} as IBuilderContextProps
);

export interface IBuilderContextProviderProps {
  fields: IBuilderFieldProps[];
  data: NormalizedQuery;
  readOnly: boolean;
  draggable?: boolean;
  singleRootGroup?: boolean;
  groupTypes?: BuilderGroupMode;
  components: IBuilderComponentsProps;
  strings: IStrings;
  setData: React.Dispatch<NormalizedQuery>;
  onChange: (data: NormalizedQuery) => void;
  updateData?: (
    updater: (currentData: NormalizedQuery) => NormalizedQuery
  ) => void;
  children: React.ReactNode;
}

export const BuilderContextProvider: FC<IBuilderContextProviderProps> = ({
  fields,
  components,
  strings,
  data,
  readOnly,
  draggable,
  singleRootGroup,
  groupTypes,
  setData,
  onChange,
  updateData,
  children,
}) => {
  const resolvedComponents = {
    ...defaultComponents,
    ...components,
    form: { ...defaultComponents.form, ...components.form },
  };

  const resolvedStrings = {
    ...defaultStrings,
    ...strings,
    rule: {
      ...defaultStrings.rule,
      ...strings.rule,
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

  return (
    <BuilderContext.Provider
      value={{
        fields,
        components: resolvedComponents,
        strings: resolvedStrings,
        data,
        readOnly,
        draggable,
        singleRootGroup,
        groupTypes,
        setData,
        onChange,
        updateData,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

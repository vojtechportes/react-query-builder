import React, { createContext } from 'react';
import {
  BuilderComponentsProps,
  BuilderFieldProps,
  defaultComponents,
} from './builder';
import { Strings, strings as defaultStrings } from './constants/strings';
import { NormalizedQuery } from './utils/query-tree';

export interface BuilderContextProps {
  fields: BuilderFieldProps[];
  data: NormalizedQuery;
  readOnly: boolean;
  components: BuilderComponentsProps;
  strings: Strings;
  setData: React.Dispatch<NormalizedQuery>;
  onChange: (data: NormalizedQuery) => void;
  updateData?: (
    updater: (currentData: NormalizedQuery) => NormalizedQuery
  ) => void;
}

export const BuilderContext = createContext<BuilderContextProps>(
  {} as BuilderContextProps
);

export interface BuilderContextProviderProps extends BuilderContextProps {
  children: React.ReactNode;
}

export const BuilderContextProvider: React.FC<BuilderContextProviderProps> = ({
  fields,
  components,
  strings,
  data,
  readOnly,
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

  return (
    <BuilderContext.Provider
      value={{
        fields,
        components: resolvedComponents,
        strings: resolvedStrings,
        data,
        readOnly,
        setData,
        onChange,
        updateData,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

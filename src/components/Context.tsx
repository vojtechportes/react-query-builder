import React, { createContext } from 'react';
import {
  BuilderFieldProps,
  BuilderComponentsProps,
  defaultComponents,
} from './Builder';
import { strings as defaultStrings, Strings } from '../constants/strings';

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

export interface BuilderContextProviderProps extends BuilderContextProps {
  children: React.ReactNode | React.ReactNodeArray;
}

export const BuilderContextProvider: React.FC<BuilderContextProviderProps> = ({
  fields,
  components,
  strings,
  data,
  setData,
  onChange,
  children,
}) => {
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

  return (
    <BuilderContext.Provider
      value={{
        fields,
        components,
        strings,
        data,
        setData,
        onChange,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

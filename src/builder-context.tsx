import React, { FC, createContext } from 'react';
import {
  BuilderGroupMode,
  IBuilderComponentsProps,
  IBuilderFieldProps,
  IBuilderValidationResult,
} from './builder/types';
import { defaultComponents } from './builder/constants/default-components';
import { IStrings, strings as defaultStrings } from './constants/strings';
import {
  BuilderHistoryAction,
  IBuilderHistoryState,
} from './history/types';
import { NormalizedQuery } from './utils/query-tree';

export interface IBuilderContextProps {
  fields: IBuilderFieldProps[];
  data: NormalizedQuery;
  readOnly: boolean;
  lockable?: boolean;
  cloneable?: boolean;
  draggable?: boolean;
  singleRootGroup?: boolean;
  groupTypes?: BuilderGroupMode;
  showValidation?: boolean;
  validation?: IBuilderValidationResult;
  components: IBuilderComponentsProps;
  strings: IStrings;
  setData?: React.Dispatch<NormalizedQuery>;
  onChange?: (data: NormalizedQuery) => void;
  updateData?: (
    updater: (currentData: NormalizedQuery) => NormalizedQuery
  ) => void;
  dispatchAction?: (action: BuilderHistoryAction) => void;
  history?: IBuilderHistoryState & {
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
  };
}

export const BuilderContext = createContext<IBuilderContextProps>(
  {} as IBuilderContextProps
);

export interface IBuilderContextProviderProps {
  fields: IBuilderFieldProps[];
  data: NormalizedQuery;
  readOnly: boolean;
  lockable?: boolean;
  cloneable?: boolean;
  draggable?: boolean;
  singleRootGroup?: boolean;
  groupTypes?: BuilderGroupMode;
  showValidation?: boolean;
  validation?: IBuilderValidationResult;
  components: IBuilderComponentsProps;
  strings: IStrings;
  setData?: React.Dispatch<NormalizedQuery>;
  onChange?: (data: NormalizedQuery) => void;
  updateData?: (
    updater: (currentData: NormalizedQuery) => NormalizedQuery
  ) => void;
  dispatchAction?: (action: BuilderHistoryAction) => void;
  history?: IBuilderContextProps['history'];
  children: React.ReactNode;
}

export const BuilderContextProvider: FC<IBuilderContextProviderProps> = ({
  fields,
  components,
  strings,
  data,
  readOnly,
  lockable,
  cloneable,
  draggable,
  singleRootGroup,
  groupTypes,
  showValidation,
  validation,
  setData,
  onChange,
  updateData,
  dispatchAction,
  history,
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
    history: {
      ...defaultStrings.history,
      ...strings.history,
    },
    validation: {
      ...defaultStrings.validation,
      ...strings.validation,
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
        lockable,
        cloneable,
        draggable,
        singleRootGroup,
        groupTypes,
        showValidation,
        validation,
        setData,
        onChange,
        updateData,
        dispatchAction,
        history,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

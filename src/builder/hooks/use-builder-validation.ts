import { useEffect, useRef, useState } from 'react';
import { IStrings } from '../../constants/strings';
import { DenormalizedQuery, NormalizedQuery } from '../../utils/query-tree';
import { createBuilderValidationResult } from '../../utils/validation/create-builder-validation-result.util';
import { validateBuilderQuery } from '../../utils/validation/validate-builder-query.util';
import { emitQuery } from '../../utils/emit-query.util';
import { isPromiseLike } from '../../utils/is-promise-like.util';
import {
  BuilderGroupMode,
  IBuilderFieldProps,
  IBuilderStateChange,
  IBuilderValidationResult,
  IBuilderValidator,
} from '../types';

export interface IUseBuilderValidationArgs {
  data: NormalizedQuery;
  originalData: DenormalizedQuery;
  fields: IBuilderFieldProps[];
  singleRootGroup: boolean;
  groupTypes: BuilderGroupMode;
  allowGroupNegation: boolean;
  allowFieldComparisons: boolean;
  strings: IStrings;
  validator?: IBuilderValidator;
  onStateChange?: (state: IBuilderStateChange) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useBuilderValidation = ({
  data,
  originalData,
  fields,
  singleRootGroup,
  groupTypes,
  allowGroupNegation,
  allowFieldComparisons,
  strings,
  validator,
  onStateChange,
  canUndo,
  canRedo,
}: IUseBuilderValidationArgs) => {
  const [validation, setValidation] = useState<IBuilderValidationResult>(() =>
    createBuilderValidationResult([])
  );
  const validationRequestId = useRef(0);

  useEffect(() => {
    const currentRequestId = validationRequestId.current + 1;
    validationRequestId.current = currentRequestId;
    let isSubscribed = true;

    const applyValidationResult = (
      denormalizedData: DenormalizedQuery,
      nextValidation: IBuilderValidationResult
    ) => {
      if (!isSubscribed || validationRequestId.current !== currentRequestId) {
        return;
      }

      setValidation(nextValidation);

      if (!onStateChange) {
        return;
      }

      onStateChange({
        data: denormalizedData,
        isValid: nextValidation.isValid,
        validation: nextValidation,
        canUndo,
        canRedo,
      });
    };

    let denormalizedData: DenormalizedQuery;
    let validationData: DenormalizedQuery;

    try {
      denormalizedData = emitQuery(data);
      validationData = emitQuery(data, { preserveIds: true });
    } catch {
      applyValidationResult(
        originalData,
        createBuilderValidationResult([
          {
            ruleId: 'root',
            field: 'root',
            code: 'invalid_tree',
            message:
              strings.validation?.invalidTree ||
              'Input data tree is in invalid format',
          },
        ])
      );

      return () => {
        isSubscribed = false;
      };
    }

    const validationContext = {
      fields,
      singleRootGroup,
      groupTypes,
      allowGroupNegation,
      allowFieldComparisons,
      strings,
    };
    const validationResult = validator
      ? validator(validationData, validationContext)
      : validateBuilderQuery(validationData, validationContext);

    if (isPromiseLike(validationResult)) {
      void validationResult.then((nextValidation) => {
        applyValidationResult(denormalizedData, nextValidation);
      });
    } else {
      applyValidationResult(denormalizedData, validationResult);
    }

    return () => {
      isSubscribed = false;
    };
  }, [
    canRedo,
    canUndo,
    data,
    fields,
    groupTypes,
    allowGroupNegation,
    allowFieldComparisons,
    onStateChange,
    originalData,
    singleRootGroup,
    strings,
    validator,
  ]);

  return validation;
};


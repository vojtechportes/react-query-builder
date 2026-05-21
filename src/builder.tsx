import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  Collision,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import styled from 'styled-components';
import { Button } from './button';
import { BuilderContextProvider } from './builder-context';
import { Rule } from './rule/rule-container';
import { IRuleProps as IRuleContainerProps } from './rule/rule-container';
import { IStrings, strings as defaultStrings } from './constants/strings';
import { DragPreview } from './drag-preview';
import { DropZone, IDropZoneProps } from './drop-zone';
import {
  EmptyGroupDropZone,
  IEmptyGroupDropZoneProps,
} from './empty-group-drop-zone';
import { Input } from './form/input';
import { IInputProps } from './form/input';
import { Select } from './form/select';
import { ISelectProps } from './form/select';
import { SelectMulti } from './form/select-multi';
import { ISelectMultiProps } from './form/select-multi';
import { Switch } from './form/switch';
import { ISwitchProps } from './form/switch';
import { Group } from './group/group-container';
import { IGroupProps as IGroupContainerProps } from './group/group-container';
import { Option as GroupHeaderOption } from './group/option';
import { IOptionProps as IGroupHeaderOptionProps } from './group/option';
import { Iterator } from './iterator';
import { LockToggle, ILockToggleProps } from './lock-toggle';
import { Popover, IPopoverProps } from './popover';
import { PopoverItem, IPopoverItemProps } from './popover-item';
import { SecondaryButton } from './secondary-button';
import { Text } from './text';
import { IButtonProps } from './button';
import { createGroupNode } from './utils/create-group-node.util';
import { createId } from './utils/create-id.util';
import { emitQuery } from './utils/emit-query.util';
import { ingestQuery } from './utils/ingest-query.util';
import { isPromiseLike } from './utils/is-promise-like.util';
import { isSameQuery } from './utils/is-same-query.util';
import { moveQueryNode } from './utils/move-query-node.util';
import { createBuilderValidationResult } from './utils/validation/create-builder-validation-result.util';
import { validateBuilderQuery } from './utils/validation/validate-builder-query.util';
import {
  DenormalizedQuery,
  INormalizedRuleNode,
  NormalizedQuery,
  QueryGroupValue,
  QueryOperator,
} from './utils/query-tree';
import { BuilderLockState } from './utils/lock-state';
import { IThemeProps } from './theme-provider/theme-provider';
import { useTheme } from './theme-provider/hooks/use-theme';

export const StyledBuilder = styled.div<{
  $theme: Required<IThemeProps>;
}>`
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: ${({ $theme }) => $theme.colors.grey['800']};
  padding: 1rem;
  background: ${({ $theme }) => $theme.colors.white};
  border: 1px solid ${({ $theme }) => $theme.colors.grey['100']};
`;

const RootControls = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  justify-content: start;
  margin-bottom: 0.5rem;
`;

const DROP_ZONE_PROXIMITY = 24;

export type BuilderGroupMode = 'with-modifiers' | 'without-modifiers' | 'both';

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
export type { BuilderLockState };

export type BuilderFieldValue =
  | string
  | number
  | string[]
  | number[]
  | boolean
  | Array<{ value: string | number; label: string }>;

export interface IBuilderValidationMessageContext {
  field: IBuilderFieldProps;
  operator?: BuilderFieldOperator;
  value?: BuilderFieldValue;
  ruleId?: string;
  rangeBoundary?: 'start' | 'end';
}

export type BuilderValidationMessage =
  | string
  | ((context: IBuilderValidationMessageContext) => string);

export interface IBuilderRangeValidation<
  TValueValidation = unknown,
  TRangeValue = string | number
> {
  common?: Partial<TValueValidation>;
  start?: Partial<TValueValidation>;
  end?: Partial<TValueValidation>;
  allowEqual?: boolean;
  requireAscending?: boolean;
  validate?: (
    range: [TRangeValue, TRangeValue],
    context: IBuilderValidationMessageContext
  ) => boolean | Promise<boolean>;
  message?: BuilderValidationMessage;
}

export interface IBuilderFieldValidationBase<TValue = unknown> {
  required?: boolean;
  oneOf?: TValue[];
  custom?: (
    value: TValue,
    context: IBuilderValidationMessageContext
  ) => boolean | Promise<boolean>;
  customMessage?: BuilderValidationMessage;
}

export interface ITextValueValidationRule
  extends IBuilderFieldValidationBase<string | string[]> {
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
}

export interface INumberValueValidationRule
  extends IBuilderFieldValidationBase<number | number[]> {
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
}

export interface IDateValueValidationRule
  extends IBuilderFieldValidationBase<string | string[]> {
  minDate?: string | Date;
  maxDate?: string | Date;
}

export type IBooleanValueValidationRule = IBuilderFieldValidationBase<boolean>;

export type IListValueValidationRule =
  IBuilderFieldValidationBase<string | number>;

export interface IMultiListValueValidationRule
  extends IBuilderFieldValidationBase<Array<string | number>> {
  minItems?: number;
  maxItems?: number;
}

export type IStatementValueValidationRule =
  IBuilderFieldValidationBase<string> & {
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
};

export type IBuilderOperatorValidationRule<TRule> = Partial<TRule> & {
  operators: BuilderFieldOperator[];
};

export interface IBuilderValidationConfig<TRule> {
  common?: Partial<TRule>;
  rules?: Array<IBuilderOperatorValidationRule<TRule>>;
}

export interface ITextFieldValidationRule extends ITextValueValidationRule {
  range?: IBuilderRangeValidation<ITextValueValidationRule, string>;
}

export interface INumberFieldValidationRule extends INumberValueValidationRule {
  range?: IBuilderRangeValidation<INumberValueValidationRule, number>;
}

export interface IDateFieldValidationRule extends IDateValueValidationRule {
  range?: IBuilderRangeValidation<IDateValueValidationRule, string>;
}

export type IStatementFieldValidationRule = IStatementValueValidationRule;
export type IBooleanFieldValidationRule = IBooleanValueValidationRule;
export type IListFieldValidationRule = IListValueValidationRule;
export type IMultiListFieldValidationRule = IMultiListValueValidationRule;

export type ITextFieldValidation =
  | Partial<ITextFieldValidationRule>
  | IBuilderValidationConfig<ITextFieldValidationRule>;

export type INumberFieldValidation =
  | Partial<INumberFieldValidationRule>
  | IBuilderValidationConfig<INumberFieldValidationRule>;

export type IDateFieldValidation =
  | Partial<IDateFieldValidationRule>
  | IBuilderValidationConfig<IDateFieldValidationRule>;

export type IBooleanFieldValidation =
  | Partial<IBooleanFieldValidationRule>
  | IBuilderValidationConfig<IBooleanFieldValidationRule>;

export type IListFieldValidation =
  | Partial<IListFieldValidationRule>
  | IBuilderValidationConfig<IListFieldValidationRule>;

export type IMultiListFieldValidation =
  | Partial<IMultiListFieldValidationRule>
  | IBuilderValidationConfig<IMultiListFieldValidationRule>;

export type IStatementFieldValidation =
  | Partial<IStatementFieldValidationRule>
  | IBuilderValidationConfig<IStatementFieldValidationRule>;

interface IBuilderFieldBase<
  TType extends BuilderFieldType,
  TValue extends BuilderFieldValue | undefined,
  TValidation
> {
  field: string;
  label: string;
  value?: TValue;
  type: TType;
  operators?: BuilderFieldOperator[];
  validation?: TValidation;
}

export type IBooleanFieldProps = IBuilderFieldBase<
  'BOOLEAN',
  boolean,
  IBooleanFieldValidation
>;

export type ITextFieldProps = IBuilderFieldBase<
  'TEXT',
  string,
  ITextFieldValidation
>;

export type IDateFieldProps = IBuilderFieldBase<
  'DATE',
  string,
  IDateFieldValidation
>;

export type INumberFieldProps = IBuilderFieldBase<
  'NUMBER',
  number,
  INumberFieldValidation
>;

export type IStatementFieldProps = IBuilderFieldBase<
  'STATEMENT',
  string,
  IStatementFieldValidation
>;

export type IListFieldProps = IBuilderFieldBase<
  'LIST',
  Array<{ value: string | number; label: string }>,
  IListFieldValidation
>;

export type IMultiListFieldProps = IBuilderFieldBase<
  'MULTI_LIST',
  Array<{ value: string | number; label: string }>,
  IMultiListFieldValidation
>;

export type IGroupFieldProps = IBuilderFieldBase<'GROUP', undefined, never>;

export type IBuilderFieldProps =
  | IBooleanFieldProps
  | ITextFieldProps
  | IDateFieldProps
  | INumberFieldProps
  | IStatementFieldProps
  | IListFieldProps
  | IMultiListFieldProps
  | IGroupFieldProps;

export type BuilderValidationSeverity = 'error' | 'warning';

export interface IBuilderValidationIssue {
  ruleId: string;
  field: string;
  message: string;
  severity?: BuilderValidationSeverity;
  code?: string;
}

export interface IBuilderValidationResult {
  isValid: boolean;
  issues: IBuilderValidationIssue[];
  issuesByRuleId: Record<string, IBuilderValidationIssue[]>;
}

export interface IBuilderValidationContext {
  fields: IBuilderFieldProps[];
  singleRootGroup: boolean;
  groupTypes: BuilderGroupMode;
  strings: IStrings;
}

export interface IBuilderValidator {
  (
    data: DenormalizedQuery,
    context: IBuilderValidationContext
  ): IBuilderValidationResult | Promise<IBuilderValidationResult>;
}

export interface IBuilderStateChange {
  data: DenormalizedQuery;
  isValid: boolean;
  validation: IBuilderValidationResult;
}

export interface IBuilderComponentsProps {
  form?: {
    Select?: React.ComponentType<ISelectProps>;
    SelectMulti?: React.ComponentType<ISelectMultiProps>;
    Switch?: React.ComponentType<ISwitchProps>;
    Input?: React.ComponentType<IInputProps>;
  };
  Remove?: React.ComponentType<IButtonProps>;
  Add?: React.ComponentType<IButtonProps>;
  LockToggle?: React.ComponentType<ILockToggleProps>;
  Rule?: React.ComponentType<IRuleContainerProps>;
  Group?: React.ComponentType<IGroupContainerProps>;
  GroupHeaderOption?: React.ComponentType<IGroupHeaderOptionProps>;
  Text?: React.ComponentType<React.ComponentProps<typeof Text>>;
  DropZone?: React.ComponentType<IDropZoneProps>;
  EmptyGroupDropZone?: React.ComponentType<IEmptyGroupDropZoneProps>;
  Popover?: React.ComponentType<IPopoverProps>;
  PopoverItem?: React.ComponentType<IPopoverItemProps>;
}

export interface IResolvedBuilderComponentsProps {
  form: {
    Select: React.ComponentType<ISelectProps>;
    SelectMulti: React.ComponentType<ISelectMultiProps>;
    Switch: React.ComponentType<ISwitchProps>;
    Input: React.ComponentType<IInputProps>;
  };
  Remove: React.ComponentType<IButtonProps>;
  Add: React.ComponentType<IButtonProps>;
  LockToggle: React.ComponentType<ILockToggleProps>;
  Rule: React.ComponentType<IRuleContainerProps>;
  Group: React.ComponentType<IGroupContainerProps>;
  GroupHeaderOption: React.ComponentType<IGroupHeaderOptionProps>;
  Text: React.ComponentType<React.ComponentProps<typeof Text>>;
  DropZone: React.ComponentType<IDropZoneProps>;
  EmptyGroupDropZone: React.ComponentType<IEmptyGroupDropZoneProps>;
  Popover: React.ComponentType<IPopoverProps>;
  PopoverItem: React.ComponentType<IPopoverItemProps>;
}

export interface IBuilderProps {
  fields: IBuilderFieldProps[];
  data: DenormalizedQuery;
  components?: IBuilderComponentsProps;
  strings?: IStrings;
  readOnly?: boolean;
  lockable?: boolean;
  draggable?: boolean;
  singleRootGroup?: boolean;
  groupTypes?: BuilderGroupMode;
  validator?: IBuilderValidator;
  onStateChange?: (state: IBuilderStateChange) => void;
  showValidation?: boolean;
  onChange?: (data: DenormalizedQuery) => any;
}

export const defaultComponents: IResolvedBuilderComponentsProps = {
  form: {
    Input,
    Select,
    SelectMulti,
    Switch,
  },
  Remove: SecondaryButton,
  Add: Button,
  LockToggle,
  Rule,
  Group,
  GroupHeaderOption,
  Text,
  DropZone,
  EmptyGroupDropZone,
  Popover,
  PopoverItem,
};

export const Builder: FC<IBuilderProps> = ({
  data: originalData = [],
  fields,
  components = defaultComponents,
  strings = defaultStrings,
  readOnly = false,
  lockable = false,
  draggable = false,
  singleRootGroup = true,
  groupTypes = 'with-modifiers',
  validator,
  onStateChange,
  showValidation = false,
  onChange,
}) => {
  const rootGroupType =
    groupTypes === 'without-modifiers' ? 'without-modifiers' : 'with-modifiers';

  const theme = useTheme();
  const [data, setData] = useState<NormalizedQuery>(() =>
    ingestQuery(originalData, rootGroupType, singleRootGroup)
  );
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDropZoneId, setActiveDropZoneId] = useState<string | null>(null);
  const [isDropSettling, setIsDropSettling] = useState(false);
  const [validation, setValidation] = useState<IBuilderValidationResult>(() =>
    createBuilderValidationResult([])
  );
  const dragDirectionY = useRef(0);
  const lastPointerY = useRef<number | null>(null);
  const lastEmittedData = useRef<DenormalizedQuery | null>(null);
  const pendingChangeData = useRef<NormalizedQuery | null>(null);
  const validationRequestId = useRef(0);
  const filteredData = data.filter((item) => !item.parent);
  const AddComponent = components.Add || Button;
  const PopoverComponent = components.Popover || Popover;
  const PopoverItemComponent = components.PopoverItem || PopoverItem;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const emitChange = useCallback(
    (nextData: NormalizedQuery) => {
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
    },
    [onChange]
  );

  const updateData = useCallback(
    (updater: (currentData: NormalizedQuery) => NormalizedQuery) => {
      setData((currentData: NormalizedQuery) => {
        const nextData = updater(currentData);

        pendingChangeData.current = nextData;

        return nextData;
      });
    },
    []
  );

  const emitStateChange = useCallback(
    (nextData: DenormalizedQuery, nextValidation: IBuilderValidationResult) => {
      if (!onStateChange) {
        return;
      }

      onStateChange({
        data: nextData,
        isValid: nextValidation.isValid,
        validation: nextValidation,
      });
    },
    [onStateChange]
  );

  useEffect(() => {
    if (!pendingChangeData.current || pendingChangeData.current !== data) {
      return;
    }

    const nextData = pendingChangeData.current;
    pendingChangeData.current = null;
    emitChange(nextData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, onChange]);

  useEffect(() => {
    if (
      lastEmittedData.current &&
      isSameQuery(lastEmittedData.current, originalData)
    ) {
      lastEmittedData.current = null;
      pendingChangeData.current = null;
      return;
    }

    pendingChangeData.current = null;
    setData(ingestQuery(originalData, rootGroupType, singleRootGroup));
  }, [originalData, rootGroupType, singleRootGroup]);

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
      emitStateChange(denormalizedData, nextValidation);
    };

    const runValidation = () => {
      let denormalizedData: DenormalizedQuery;
      let validationData: DenormalizedQuery;

      try {
        denormalizedData = emitQuery(data);
        validationData = emitQuery(data, { preserveIds: true });
      } catch (error) {
        const nextValidation = createBuilderValidationResult([
          {
            ruleId: 'root',
            field: 'root',
            code: 'invalid_tree',
            message:
              strings.validation?.invalidTree || 'Input data tree is in invalid format',
          },
        ]);

        applyValidationResult(originalData, nextValidation);
        return;
      }

      const validationContext: IBuilderValidationContext = {
        fields,
        singleRootGroup,
        groupTypes,
        strings,
      };
      const validationResult = validator
        ? validator(validationData, validationContext)
        : validateBuilderQuery(validationData, validationContext);

      if (isPromiseLike(validationResult)) {
        void validationResult.then((nextValidation) => {
          applyValidationResult(denormalizedData, nextValidation);
        });
        return;
      }

      applyValidationResult(denormalizedData, validationResult);
    };

    runValidation();

    return () => {
      isSubscribed = false;
    };
  }, [
    data,
    emitStateChange,
    fields,
    groupTypes,
    originalData,
    singleRootGroup,
    strings,
    validator,
  ]);

  const resetDragState = useCallback(() => {
    setActiveDragId(null);
    setActiveDropZoneId(null);
  }, []);

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveDragId(String(active.id));

    dragDirectionY.current = 0;
    lastPointerY.current = null;
  }, []);

  const handleDragMove = useCallback(({ activatorEvent }: DragMoveEvent) => {
    if (
      !('clientY' in activatorEvent) ||
      typeof activatorEvent.clientY !== 'number'
    ) {
      return;
    }

    const currentPointerY = activatorEvent.clientY;

    if (lastPointerY.current !== null) {
      dragDirectionY.current = currentPointerY - lastPointerY.current;
    }

    lastPointerY.current = currentPointerY;
  }, []);

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    setActiveDropZoneId(over ? String(over.id) : null);
  }, []);

  const handleDragCancel = useCallback(() => {
    resetDragState();

    lastPointerY.current = null;

    setIsDropSettling(false);
  }, [resetDragState]);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      const dropZoneId = over ? String(over.id) : null;

      if (!draggable || readOnly || !dropZoneId) {
        resetDragState();
        lastPointerY.current = null;
        return;
      }

      flushSync(() => {
        updateData((currentData) =>
          moveQueryNode(currentData, String(active.id), dropZoneId)
        );
      });

      setIsDropSettling(true);

      lastPointerY.current = null;

      resetDragState();
      requestAnimationFrame(() => {
        setIsDropSettling(false);
      });
    },
    [draggable, readOnly, resetDragState, updateData]
  );

  const handleAddRootGroup = useCallback(() => {
    updateData((currentData) => [
      ...currentData,
      createGroupNode('with-modifiers'),
    ]);
  }, [updateData]);

  const handleAddRootGroupWithoutModifiers = useCallback(() => {
    updateData((currentData) => [
      ...currentData,
      createGroupNode('without-modifiers'),
    ]);
  }, [updateData]);

  const handleAddRootRule = useCallback(() => {
    const emptyRule: INormalizedRuleNode = {
      field: '',
      id: createId(),
    };

    updateData((currentData) => [...currentData, emptyRule]);
  }, [updateData]);

  const collisionDetection: CollisionDetection = useCallback(
    ({ pointerCoordinates, droppableContainers, droppableRects }) => {
      if (!pointerCoordinates) {
        return [];
      }

      const isMovingUp = dragDirectionY.current < 0;
      const isMovingDown = dragDirectionY.current > 0;

      const collisions = droppableContainers
        .filter((container) => String(container.id).startsWith('drop-zone:'))
        .map((container) => {
          const rect = droppableRects.get(container.id);
          const isEmptyZone = Boolean(container.data.current?.isEmpty);

          if (!rect) {
            return null;
          }

          const isWithinHorizontalBounds =
            pointerCoordinates.x >= rect.left &&
            pointerCoordinates.x <= rect.right;

          if (!isWithinHorizontalBounds) {
            return null;
          }

          const isWithinVerticalBounds =
            pointerCoordinates.y >= rect.top &&
            pointerCoordinates.y <= rect.bottom;

          if (isEmptyZone) {
            if (!isWithinVerticalBounds) {
              return null;
            }

            return {
              id: container.id,
              data: {
                droppableContainer: container,
                value: 0,
              },
            } as Collision;
          }

          if (isWithinVerticalBounds) {
            return {
              id: container.id,
              data: {
                droppableContainer: container,
                value: 0,
              },
            } as Collision;
          }

          const distanceToTop = Math.abs(pointerCoordinates.y - rect.top);
          const distanceToBottom = Math.abs(pointerCoordinates.y - rect.bottom);
          const distance = Math.min(distanceToTop, distanceToBottom);

          if (distance > DROP_ZONE_PROXIMITY) {
            return null;
          }

          if (isMovingUp && pointerCoordinates.y > rect.bottom) {
            return null;
          }

          if (isMovingDown && pointerCoordinates.y < rect.top) {
            return null;
          }

          return {
            id: container.id,
            data: {
              droppableContainer: container,
              value: distance,
            },
          } as Collision;
        })
        .filter(Boolean) as Collision[];

      return collisions.sort(
        (leftCollision, rightCollision) =>
          (leftCollision.data?.value as number) -
          (rightCollision.data?.value as number)
      );
    },
    []
  );

  const content = (
    <Iterator
      originalData={data}
      filteredData={filteredData}
      activeDropZoneId={activeDropZoneId}
      activeDragId={activeDragId}
      isDragging={Boolean(activeDragId)}
      disableDropZoneTransition={isDropSettling}
    />
  );

  return (
    <BuilderContextProvider
      fields={fields}
      components={components}
      strings={strings}
      readOnly={readOnly}
      lockable={lockable}
      draggable={draggable}
      singleRootGroup={singleRootGroup}
      groupTypes={groupTypes}
      showValidation={showValidation}
      validation={validation}
      data={data}
      setData={setData}
      onChange={emitChange}
      updateData={updateData}
    >
      <StyledBuilder $theme={theme}>
        {!readOnly && strings.group && !singleRootGroup && (
          <RootControls>
            <AddComponent onClick={handleAddRootRule} data-test="AddRootRule">
              {strings.group.addRule}
            </AddComponent>
            {groupTypes === 'both' ? (
              <PopoverComponent
                label={strings.group.addGroup || 'Add Group'}
                data-test="AddRootGroup"
              >
                <PopoverItemComponent
                  label={
                    strings.group.addGroupWithModifiers || 'With Modifiers'
                  }
                  onClick={handleAddRootGroup}
                  data-test="AddRootGroupWithModifiers"
                />
                <PopoverItemComponent
                  label={
                    strings.group.addGroupWithoutModifiers ||
                    'Without Modifiers'
                  }
                  onClick={handleAddRootGroupWithoutModifiers}
                  data-test="AddRootGroupWithoutModifiers"
                />
              </PopoverComponent>
            ) : (
              <AddComponent
                onClick={
                  groupTypes === 'without-modifiers'
                    ? handleAddRootGroupWithoutModifiers
                    : handleAddRootGroup
                }
                data-test="AddRootGroup"
              >
                {strings.group.addGroup}
              </AddComponent>
            )}
          </RootControls>
        )}
        {draggable && !readOnly ? (
          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
          >
            {content}
            <DragOverlay dropAnimation={null}>
              {activeDragId ? (
                <DragPreview activeId={activeDragId} data={data} />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          content
        )}
      </StyledBuilder>
    </BuilderContextProvider>
  );
};

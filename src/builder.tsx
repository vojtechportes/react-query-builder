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
import { Button, IButtonProps } from './button';
import { BuilderContextProvider } from './builder-context';
import { IStrings, strings as defaultStrings } from './constants/strings';
import { DropZone, IDropZoneProps } from './drop-zone';
import { DragPreview } from './drag-preview';
import {
  EmptyGroupDropZone,
  IEmptyGroupDropZoneProps,
} from './empty-group-drop-zone';
import { Input, IInputProps } from './form/input';
import { Select, ISelectProps } from './form/select';
import { SelectMulti, ISelectMultiProps } from './form/select-multi';
import { Switch, ISwitchProps } from './form/switch';
import {
  applyHistoryAction,
} from './history/apply-history-action';
import { createBuilderHistoryState } from './history/create-builder-history-state';
import { createInsertSubtreeAction } from './history/create-insert-subtree-action';
import { createMoveNodeAction } from './history/create-move-node-action';
import type {
  BuilderHistoryAction,
  IBuilderHistoryConfig,
  IBuilderHistoryState,
} from './history/types';
import { Iterator } from './iterator';
import { CloneButton, ICloneButtonProps } from './clone-button';
import { Group, IGroupProps as IGroupContainerProps } from './group/group-container';
import { Option as GroupHeaderOption } from './group/option';
import { IOptionProps as IGroupHeaderOptionProps } from './group/option';
import { LockToggle, ILockToggleProps } from './lock-toggle';
import { Popover, IPopoverProps } from './popover';
import { PopoverItem, IPopoverItemProps } from './popover-item';
import { Rule, IRuleProps as IRuleContainerProps } from './rule/rule-container';
import { SecondaryButton } from './secondary-button';
import { Text } from './text';
import { useTheme } from './theme-provider/hooks/use-theme';
import { IThemeProps } from './theme-provider/theme-provider';
import { createGroupNode } from './utils/create-group-node.util';
import { createId } from './utils/create-id.util';
import { emitQuery } from './utils/emit-query.util';
import { ingestQuery } from './utils/ingest-query.util';
import { isPromiseLike } from './utils/is-promise-like.util';
import { isSameQuery } from './utils/is-same-query.util';
import { BuilderLockState } from './utils/lock-state';
import {
  DenormalizedQuery,
  INormalizedRuleNode,
  NormalizedQuery,
  QueryGroupValue,
  QueryOperator,
} from './utils/query-tree';
import { createBuilderValidationResult } from './utils/validation/create-builder-validation-result.util';
import { validateBuilderQuery } from './utils/validation/validate-builder-query.util';

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

const HistoryButton = styled(Button)<{
  $theme: Required<IThemeProps>;
}>`
  background-color: ${({ $theme }) => $theme.colors.white};
  border: 1px solid ${({ $theme }) => $theme.colors.grey['300']};
  color: ${({ $theme }) => $theme.colors.grey['700']};
  text-transform: none;
  font-size: 0.75rem;
  padding: 0.5rem 0.9rem;

  &:hover {
    background-color: ${({ $theme }) => $theme.colors.grey['100']};
    color: ${({ $theme }) => $theme.colors.grey['800']};
  }

  &:disabled {
    background-color: ${({ $theme }) => $theme.colors.grey['100']};
    border-color: ${({ $theme }) => $theme.colors.grey['200']};
    color: ${({ $theme }) => $theme.colors.grey['400']};
    cursor: not-allowed;
  }

  &:disabled:hover {
    background-color: ${({ $theme }) => $theme.colors.grey['100']};
    color: ${({ $theme }) => $theme.colors.grey['400']};
  }
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
export type {
  BuilderHistoryAction as IBuilderHistoryAction,
  IBuilderHistoryConfig,
  IBuilderHistoryState,
} from './history/types';

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
  canUndo: boolean;
  canRedo: boolean;
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
  CloneButton?: React.ComponentType<ICloneButtonProps>;
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
  CloneButton: React.ComponentType<ICloneButtonProps>;
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
  cloneable?: boolean;
  draggable?: boolean;
  singleRootGroup?: boolean;
  groupTypes?: BuilderGroupMode;
  validator?: IBuilderValidator;
  onStateChange?: (state: IBuilderStateChange) => void;
  showValidation?: boolean;
  history?: boolean | IBuilderHistoryConfig;
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
  CloneButton,
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
  cloneable = false,
  draggable = false,
  singleRootGroup = true,
  groupTypes = 'with-modifiers',
  validator,
  onStateChange,
  showValidation = false,
  history = false,
  onChange,
}) => {
  const rootGroupType =
    groupTypes === 'without-modifiers' ? 'without-modifiers' : 'with-modifiers';
  const resolvedHistoryConfig =
    history && typeof history === 'object' ? history : history ? {} : null;
  const historyEnabled = Boolean(history);
  const historyMaxEntries = resolvedHistoryConfig?.maxEntries || 50;
  const showHistoryControls =
    historyEnabled && resolvedHistoryConfig?.controls !== false;

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
  const [historyState, setHistoryState] = useState<IBuilderHistoryState>(() =>
    createBuilderHistoryState()
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
  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

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
      } catch {
        throw new Error('Input data tree is in invalid format');
      }
    },
    [onChange]
  );

  const commitData = useCallback(
    (
      action: BuilderHistoryAction,
      options: { trackHistory?: boolean } = {}
    ): boolean => {
      const appliedAction = applyHistoryAction(data, action);

      if (!appliedAction) {
        return false;
      }
      pendingChangeData.current = appliedAction.data;
      setData(appliedAction.data);

      if (options.trackHistory !== false && historyEnabled) {
        setHistoryState((currentHistory) => ({
          past: [
            ...currentHistory.past.slice(-(historyMaxEntries - 1)),
            {
              undo: appliedAction.inverse,
              redo: action,
            },
          ],
          future: [],
        }));
      }

      return true;
    },
    [data, historyEnabled, historyMaxEntries]
  );

  const dispatchAction = useCallback(
    (action: BuilderHistoryAction) => {
      commitData(action);
    },
    [commitData]
  );

  const undo = useCallback(() => {
    if (!historyEnabled) {
      return;
    }

    const entry = historyState.past[historyState.past.length - 1];

    if (!entry) {
      return;
    }

    if (!commitData(entry.undo, { trackHistory: false })) {
      return;
    }

    setHistoryState((currentHistory) => ({
      past: currentHistory.past.slice(0, -1),
      future: [entry, ...currentHistory.future],
    }));
  }, [commitData, historyEnabled, historyState.past]);

  const redo = useCallback(() => {
    if (!historyEnabled) {
      return;
    }

    const entry = historyState.future[0];

    if (!entry) {
      return;
    }

    if (!commitData(entry.redo, { trackHistory: false })) {
      return;
    }

    setHistoryState((currentHistory) => ({
      past: [...currentHistory.past, entry],
      future: currentHistory.future.slice(1),
    }));
  }, [commitData, historyEnabled, historyState.future]);

  const emitStateChange = useCallback(
    (nextData: DenormalizedQuery, nextValidation: IBuilderValidationResult) => {
      if (!onStateChange) {
        return;
      }

      onStateChange({
        data: nextData,
        isValid: nextValidation.isValid,
        validation: nextValidation,
        canUndo,
        canRedo,
      });
    },
    [canRedo, canUndo, onStateChange]
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
    setHistoryState(createBuilderHistoryState());
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
      } catch {
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
    canRedo,
    canUndo,
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

      if (!draggable || readOnly || !dropZoneId || !dropZoneId.startsWith('drop-zone:')) {
        resetDragState();
        lastPointerY.current = null;
        return;
      }

      const [, destinationParentSegment, destinationIndexSegment] =
        dropZoneId.split(':');
      const destinationParentId =
        destinationParentSegment === 'root'
          ? undefined
          : destinationParentSegment;
      const destinationIndex = Number(destinationIndexSegment);

      if (Number.isNaN(destinationIndex)) {
        resetDragState();
        lastPointerY.current = null;
        return;
      }

      flushSync(() => {
        commitData(
          createMoveNodeAction(
            String(active.id),
            destinationIndex,
            destinationParentId
          )
        );
      });

      setIsDropSettling(true);
      lastPointerY.current = null;
      resetDragState();
      requestAnimationFrame(() => {
        setIsDropSettling(false);
      });
    },
    [commitData, draggable, readOnly, resetDragState]
  );

  const handleAddRootGroup = useCallback(() => {
    dispatchAction(
      createInsertSubtreeAction(
        [createGroupNode('with-modifiers')],
        filteredData.length
      )
    );
  }, [dispatchAction, filteredData.length]);

  const handleAddRootGroupWithoutModifiers = useCallback(() => {
    dispatchAction(
      createInsertSubtreeAction(
        [createGroupNode('without-modifiers')],
        filteredData.length
      )
    );
  }, [dispatchAction, filteredData.length]);

  const handleAddRootRule = useCallback(() => {
    const emptyRule: INormalizedRuleNode = {
      field: '',
      id: createId(),
    };

    dispatchAction(createInsertSubtreeAction([emptyRule], filteredData.length));
  }, [dispatchAction, filteredData.length]);

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
      cloneable={cloneable}
      draggable={draggable}
      singleRootGroup={singleRootGroup}
      groupTypes={groupTypes}
      showValidation={showValidation}
      validation={validation}
      data={data}
      dispatchAction={dispatchAction}
      history={{
        ...historyState,
        canUndo,
        canRedo,
        undo,
        redo,
      }}
    >
      <StyledBuilder $theme={theme}>
        {((!readOnly && strings.group && !singleRootGroup) ||
          showHistoryControls) && (
          <RootControls>
            {showHistoryControls && strings.history && (
              <>
                <HistoryButton
                  onClick={undo}
                  disabled={!canUndo}
                  data-test="Undo"
                  $theme={theme}
                >
                  {strings.history.undo}
                </HistoryButton>
                <HistoryButton
                  onClick={redo}
                  disabled={!canRedo}
                  data-test="Redo"
                  $theme={theme}
                >
                  {strings.history.redo}
                </HistoryButton>
              </>
            )}
            {!readOnly && strings.group && !singleRootGroup && (
              <>
                <AddComponent onClick={handleAddRootRule} data-test="AddRootRule">
                  {strings.group.addRule}
                </AddComponent>
                {groupTypes === 'both' ? (
                  <PopoverComponent
                    label={strings.group.addGroup || 'Add Group'}
                    data-test="AddRootGroup"
                  >
                    <PopoverItemComponent
                      label={strings.group.addGroupWithModifiers || 'With Modifiers'}
                      onClick={handleAddRootGroup}
                      data-test="AddRootGroupWithModifiers"
                    />
                    <PopoverItemComponent
                      label={
                        strings.group.addGroupWithoutModifiers || 'Without Modifiers'
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
              </>
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

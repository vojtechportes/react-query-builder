import * as React from 'react';
import styled from 'styled-components';
import { siteTheme } from '../../../../constants/site-theme';
import { localeOptions } from '../constants/locale-options';
import type { LocaleId } from '../types/locale-id';

const Panel = styled.section`
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
`;

const ToggleRow = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #334155;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const Toggle = styled.input<{ $disabled?: boolean }>`
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #2563eb;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  flex: 0 0 18px;

  &:disabled {
    opacity: 1;
  }
`;

const SelectField = styled.label`
  display: grid;
  gap: 0.35rem;
`;

const SelectFieldLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 400;
  color: #334155;
`;

const SelectControl = styled.select`
  width: 100%;
  padding: 0.68rem 2.2rem 0.68rem 0.85rem;
  border: 1px solid #dbe4f0;
  border-radius: 10px;
  background: #fff;
  color: #0f172a;
  font-size: 0.92rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%230f172a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.85rem center;

  &:focus {
    outline: none;
    border-color: ${siteTheme.primaryLight};
    box-shadow: 0 0 0 3px ${siteTheme.primaryGlow};
  }
`;

export interface IDemoPlaygroundControlsProps {
  allowFieldComparisons: boolean;
  allowGroupNegation: boolean;
  cloneable: boolean;
  defaultMode: 'builder' | 'text';
  draggable: boolean;
  history: boolean;
  locale: LocaleId;
  lockable: boolean;
  newNodePlacement: 'append' | 'prepend';
  readOnly: boolean;
  readOnlyProtectsDelete: boolean;
  showValidation: boolean;
  singleRootGroup: boolean;
  textMode: boolean;
  useMonacoTextEditor: boolean;
  onAllowFieldComparisonsChange: (value: boolean) => void;
  onAllowGroupNegationChange: (value: boolean) => void;
  onCloneableChange: (value: boolean) => void;
  onDefaultModeChange: (value: 'builder' | 'text') => void;
  onDraggableChange: (value: boolean) => void;
  onHistoryChange: (value: boolean) => void;
  onLocaleChange: (value: LocaleId) => void;
  onLockableChange: (value: boolean) => void;
  onNewNodePlacementChange: (value: 'append' | 'prepend') => void;
  onReadOnlyChange: (value: boolean) => void;
  onReadOnlyProtectsDeleteChange: (value: boolean) => void;
  onShowValidationChange: (value: boolean) => void;
  onSingleRootGroupChange: (value: boolean) => void;
  onTextModeChange: (value: boolean) => void;
  onUseMonacoTextEditorChange: (value: boolean) => void;
}

export const DemoPlaygroundControls: React.FC<IDemoPlaygroundControlsProps> = ({
  allowFieldComparisons,
  allowGroupNegation,
  cloneable,
  defaultMode,
  draggable,
  history,
  locale,
  lockable,
  newNodePlacement,
  readOnly,
  readOnlyProtectsDelete,
  showValidation,
  singleRootGroup,
  textMode,
  useMonacoTextEditor,
  onAllowFieldComparisonsChange,
  onAllowGroupNegationChange,
  onCloneableChange,
  onDefaultModeChange,
  onDraggableChange,
  onHistoryChange,
  onLocaleChange,
  onLockableChange,
  onNewNodePlacementChange,
  onReadOnlyChange,
  onReadOnlyProtectsDeleteChange,
  onShowValidationChange,
  onSingleRootGroupChange,
  onTextModeChange,
  onUseMonacoTextEditorChange,
}) => (
  <Panel>
    <PanelTitle>Controls</PanelTitle>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={readOnly}
        onChange={(event) => onReadOnlyChange(event.target.checked)}
      />
      <span>Read-only mode</span>
    </ToggleRow>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={lockable}
        onChange={(event) => onLockableChange(event.target.checked)}
      />
      <span>Lock controls</span>
    </ToggleRow>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={readOnlyProtectsDelete}
        onChange={(event) =>
          onReadOnlyProtectsDeleteChange(event.target.checked)
        }
      />
      <span>Read-only protects group delete</span>
    </ToggleRow>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={cloneable}
        onChange={(event) => onCloneableChange(event.target.checked)}
      />
      <span>Clone controls</span>
    </ToggleRow>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={draggable}
        onChange={(event) => onDraggableChange(event.target.checked)}
      />
      <span>Draggable nodes</span>
    </ToggleRow>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={allowGroupNegation}
        onChange={(event) => onAllowGroupNegationChange(event.target.checked)}
      />
      <span>Allow group negation</span>
    </ToggleRow>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={allowFieldComparisons}
        onChange={(event) =>
          onAllowFieldComparisonsChange(event.target.checked)
        }
      />
      <span>Allow field comparisons</span>
    </ToggleRow>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={history}
        onChange={(event) => onHistoryChange(event.target.checked)}
      />
      <span>Undo / redo history</span>
    </ToggleRow>
    <ToggleRow $disabled={!singleRootGroup}>
      <Toggle
        type="checkbox"
        checked={textMode}
        disabled={!singleRootGroup}
        $disabled={!singleRootGroup}
        onChange={(event) => onTextModeChange(event.target.checked)}
      />
      <span>
        Text editor mode
        {!singleRootGroup ? ' (requires single root group)' : ''}
      </span>
    </ToggleRow>
    <ToggleRow $disabled={!textMode}>
      <Toggle
        type="checkbox"
        checked={defaultMode === 'text'}
        disabled={!textMode}
        $disabled={!textMode}
        onChange={(event) =>
          onDefaultModeChange(event.target.checked ? 'text' : 'builder')
        }
      />
      <span>
        Open in text mode{!textMode ? ' (requires text editor mode)' : ''}
      </span>
    </ToggleRow>
    <ToggleRow $disabled={!textMode}>
      <Toggle
        type="checkbox"
        checked={useMonacoTextEditor}
        disabled={!textMode}
        $disabled={!textMode}
        onChange={(event) => onUseMonacoTextEditorChange(event.target.checked)}
      />
      <span>
        Monaco text editor{!textMode ? ' (requires text editor mode)' : ''}
      </span>
    </ToggleRow>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={singleRootGroup}
        onChange={(event) => onSingleRootGroupChange(event.target.checked)}
      />
      <span>Single root group</span>
    </ToggleRow>
    <ToggleRow>
      <Toggle
        type="checkbox"
        checked={showValidation}
        onChange={(event) => onShowValidationChange(event.target.checked)}
      />
      <span>Show validation errors</span>
    </ToggleRow>
    <SelectField>
      <SelectFieldLabel>New node placement</SelectFieldLabel>
      <SelectControl
        value={newNodePlacement}
        onChange={(event) =>
          onNewNodePlacementChange(event.target.value as 'append' | 'prepend')
        }
      >
        <option value="append">Append to end</option>
        <option value="prepend">Prepend to start</option>
      </SelectControl>
    </SelectField>
    <SelectField>
      <SelectFieldLabel>Locale</SelectFieldLabel>
      <SelectControl
        value={locale}
        onChange={(event) => onLocaleChange(event.target.value as LocaleId)}
      >
        {localeOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </SelectControl>
    </SelectField>
  </Panel>
);

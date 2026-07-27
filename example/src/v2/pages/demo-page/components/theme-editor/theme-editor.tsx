import * as React from 'react';
import type { IBuilderStyle } from '@vojtechportes/react-query-builder';
import { themeVariableGroups } from '../../constants/theme-variable-groups';
import styles from './theme-editor.module.css';

export interface IThemeEditorProps {
  value: IBuilderStyle;
  onChange: (style: IBuilderStyle) => void;
  disabled?: boolean;
  disabledMessage?: string;
}

export const ThemeEditor: React.FC<IThemeEditorProps> = ({
  value,
  onChange,
  disabled = false,
  disabledMessage,
}) => (
  <section className={styles.root}>
    <h3 className={styles.title}>CSS variables</h3>
    {disabled && disabledMessage ? (
      <p className={styles.disabledNote}>{disabledMessage}</p>
    ) : null}
    {themeVariableGroups.map((group) => (
      <section className={styles.root} key={group.label}>
        <h4 className={styles.title}>{group.label}</h4>
        <div className={styles.grid} data-disabled={disabled}>
          {group.controls.map((control) => {
            const variableValue = String(value[control.name] ?? '');

            return control.type === 'color' ? (
              <label
                className={styles.colorRow}
                data-disabled={disabled}
                htmlFor={control.name}
                key={control.name}
              >
                <span
                  className={styles.swatch}
                  style={{ background: variableValue }}
                />
                <input
                  className={styles.colorInput}
                  id={control.name}
                  type="color"
                  value={variableValue}
                  disabled={disabled}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      [control.name]: event.target.value,
                    })
                  }
                />
                <span>{control.label}</span>
              </label>
            ) : (
              <label className={styles.textRow} key={control.name}>
                <span>{control.label}</span>
                <input
                  className={styles.textInput}
                  aria-label={control.label}
                  value={variableValue}
                  disabled={disabled}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      [control.name]: event.target.value,
                    })
                  }
                />
              </label>
            );
          })}
        </div>
      </section>
    ))}
  </section>
);

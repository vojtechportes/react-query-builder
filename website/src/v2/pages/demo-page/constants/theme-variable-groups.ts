import type { IThemeVariableGroup } from '../types/theme-variable-group';

export const themeVariableGroups: IThemeVariableGroup[] = [
  {
    label: 'Colors',
    controls: [
      {
        label: 'Primary',
        name: '--query-builder-color-primary-default',
        type: 'color',
      },
      {
        label: 'Primary light',
        name: '--query-builder-color-primary-light',
        type: 'color',
      },
      {
        label: 'Primary dark',
        name: '--query-builder-color-primary-dark',
        type: 'color',
      },
      {
        label: 'Primary contrast',
        name: '--query-builder-color-primary-contrast-text',
        type: 'color',
      },
      {
        label: 'Secondary',
        name: '--query-builder-color-secondary-default',
        type: 'color',
      },
      {
        label: 'Secondary light',
        name: '--query-builder-color-secondary-light',
        type: 'color',
      },
      {
        label: 'Secondary dark',
        name: '--query-builder-color-secondary-dark',
        type: 'color',
      },
      {
        label: 'Secondary contrast',
        name: '--query-builder-color-secondary-contrast-text',
        type: 'color',
      },
      {
        label: 'Grey 100',
        name: '--query-builder-color-grey-100',
        type: 'color',
      },
      {
        label: 'Grey 200',
        name: '--query-builder-color-grey-200',
        type: 'color',
      },
      {
        label: 'Grey 300',
        name: '--query-builder-color-grey-300',
        type: 'color',
      },
      {
        label: 'Grey 400',
        name: '--query-builder-color-grey-400',
        type: 'color',
      },
      {
        label: 'Grey 500',
        name: '--query-builder-color-grey-500',
        type: 'color',
      },
      {
        label: 'Grey 600',
        name: '--query-builder-color-grey-600',
        type: 'color',
      },
      {
        label: 'Grey 700',
        name: '--query-builder-color-grey-700',
        type: 'color',
      },
      {
        label: 'Grey 800',
        name: '--query-builder-color-grey-800',
        type: 'color',
      },
      {
        label: 'Grey 900',
        name: '--query-builder-color-grey-900',
        type: 'color',
      },
      {
        label: 'Info primary',
        name: '--query-builder-color-info-primary',
        type: 'color',
      },
      {
        label: 'Info light',
        name: '--query-builder-color-info-light',
        type: 'color',
      },
      {
        label: 'Success primary',
        name: '--query-builder-color-success-primary',
        type: 'color',
      },
      {
        label: 'Success light',
        name: '--query-builder-color-success-light',
        type: 'color',
      },
      {
        label: 'Warning primary',
        name: '--query-builder-color-warning-primary',
        type: 'color',
      },
      {
        label: 'Warning light',
        name: '--query-builder-color-warning-light',
        type: 'color',
      },
      {
        label: 'Error primary',
        name: '--query-builder-color-error-primary',
        type: 'color',
      },
      {
        label: 'Error light',
        name: '--query-builder-color-error-light',
        type: 'color',
      },
      {
        label: 'Background',
        name: '--query-builder-color-background',
        type: 'color',
      },
    ],
  },
  {
    label: 'Padding',
    controls: [
      {
        label: 'Builder padding',
        name: '--query-builder-root-padding',
        type: 'text',
      },
      {
        label: 'Group padding',
        name: '--query-builder-group-padding',
        type: 'text',
      },
      {
        label: 'Rule padding',
        name: '--query-builder-rule-padding',
        type: 'text',
      },
    ],
  },
  {
    label: 'Radius',
    controls: [
      {
        label: 'Control radius',
        name: '--query-builder-radius-sm',
        type: 'text',
      },
      {
        label: 'Builder radius',
        name: '--query-builder-root-radius',
        type: 'text',
      },
    ],
  },
  {
    label: 'Shadow',
    controls: [
      {
        label: 'Group shadow',
        name: '--query-builder-shadow-group',
        type: 'text',
      },
      {
        label: 'Builder shadow',
        name: '--query-builder-shadow-root',
        type: 'text',
      },
    ],
  },
];

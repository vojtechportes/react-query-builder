import type { IDemoPlaygroundSettings } from '../types/demo-playground-settings';

export const defaultDemoPlaygroundSettings: IDemoPlaygroundSettings = {
  allowFieldComparisons: true,
  allowGroupNegation: true,
  cloneable: false,
  defaultMode: 'builder',
  draggable: false,
  history: false,
  locale: 'en-US',
  lockable: false,
  newNodePlacement: 'append',
  readOnly: false,
  readOnlyProtectsDelete: true,
  showValidation: true,
  singleRootGroup: true,
  textMode: false,
  useMonacoTextEditor: false,
};

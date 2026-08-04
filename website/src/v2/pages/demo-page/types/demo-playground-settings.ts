export interface IDemoPlaygroundSettings {
  allowFieldComparisons: boolean;
  allowGroupNegation: boolean;
  cloneable: boolean;
  defaultMode: 'builder' | 'text';
  draggable: boolean;
  history: boolean;
  locale: import('./locale-id').LocaleId;
  lockable: boolean;
  newNodePlacement: 'append' | 'prepend';
  readOnly: boolean;
  readOnlyProtectsDelete: boolean;
  showOuterContainer: boolean;
  showValidation: boolean;
  singleRootGroup: boolean;
  textMode: boolean;
  useMonacoTextEditor: boolean;
}

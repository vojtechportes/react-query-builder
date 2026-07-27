export const loadSharedFieldOptionsDemo = () =>
  import('./shared-field-options-demo').then((module) => ({
    default: module.SharedFieldOptionsDemo,
  }));

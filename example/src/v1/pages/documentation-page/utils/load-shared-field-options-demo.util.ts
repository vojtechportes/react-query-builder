export const loadSharedFieldOptionsDemo = () =>
  import('../components/shared-field-options-demo').then((module) => ({
    default: module.SharedFieldOptionsDemo,
  }));

export const loadImperativeFieldOptionsDemo = () =>
  import('../components/imperative-field-options-demo').then((module) => ({
    default: module.ImperativeFieldOptionsDemo,
  }));

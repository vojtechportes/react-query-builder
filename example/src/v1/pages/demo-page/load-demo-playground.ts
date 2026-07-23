export const loadDemoPlayground = () =>
  import('./components/demo-playground').then((module) => ({
    default: module.DemoPlayground,
  }));

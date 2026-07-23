export const loadParsingSandbox = () =>
  import('../components/parsing-sandbox').then((module) => ({
    default: module.ParsingSandbox,
  }));

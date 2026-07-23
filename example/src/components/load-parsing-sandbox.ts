export const loadParsingSandbox = () =>
  import('./parsing-sandbox').then((module) => ({
    default: module.ParsingSandbox,
  }));

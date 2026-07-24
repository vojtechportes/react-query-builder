const classNames = new Proxy(
  {},
  {
    get: (_target, property) =>
      typeof property === 'string' ? property : undefined,
  }
);

module.exports = {
  __esModule: true,
  default: classNames,
};

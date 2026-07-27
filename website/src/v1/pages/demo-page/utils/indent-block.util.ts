export const indentBlock = (block: string, spaces: number) =>
  block
    .split('\n')
    .map((line) => `${' '.repeat(spaces)}${line}`)
    .join('\n');

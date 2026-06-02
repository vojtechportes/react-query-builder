export const joinClassNames = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export const bootstrapControlStyles = {
  width: 'var(--query-builder-control-width, 160px)',
  minWidth: 'var(--query-builder-control-min-width, 160px)',
  maxWidth: '100%',
} as const;

export const bootstrapCardStyles = {
  borderRadius: '0.5rem',
} as const;

export const bootstrapIconButtonStyles = {
  width: 'calc(1.5em + 0.5rem + 2px)',
  minWidth: 'calc(1.5em + 0.5rem + 2px)',
  height: 'calc(1.5em + 0.5rem + 2px)',
  padding: '0.25rem',
  flexShrink: 0,
} as const;

export const bootstrapIconButtonContentStyles = {
  width: '1rem',
  height: '1rem',
  lineHeight: 1,
} as const;

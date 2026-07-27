export type BuilderFieldValue =
  | string
  | number
  | string[]
  | number[]
  | boolean
  | Array<{ value: string | number; label: string }>;

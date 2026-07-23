import { colors } from '@vojtechportes/react-query-builder';
import { IColors } from '@vojtechportes/react-query-builder';

type ObjectKeys<T> = {
  [K in keyof T]: T[K] extends object ? K : never;
}[keyof T];

type ColorGroupKey = ObjectKeys<IColors>;

export const isColorGroupKey = (key: string): key is ColorGroupKey => {
  return (
    (key in colors && typeof colors[key as keyof IColors] === 'object') ||
    key in colors
  );
};

import { colors } from "../../../../src";
import { IColors } from "../../../../src/constants/colors";

type ObjectKeys<T> = {
  [K in keyof T]: T[K] extends object ? K : never;
}[keyof T];

type ColorGroupKey = ObjectKeys<IColors>;

export const isColorGroupKey = (key: string): key is ColorGroupKey => {
  return key in colors && typeof colors[key as keyof IColors] === 'object' || key in colors;
};
import type { IColors } from '@vojtechportes/react-query-builder';
import type { ColorPath } from '../types/color-path';

export const getColorValue = (themeColors: IColors, path: ColorPath) => {
  if (path === 'white') {
    return themeColors.white;
  }

  const keys = path.split('.');

  if (
    keys[0] === 'info' ||
    keys[0] === 'success' ||
    keys[0] === 'warning' ||
    keys[0] === 'error'
  ) {
    const [group, key] = keys as [
      keyof Pick<IColors, 'info' | 'success' | 'warning' | 'error'>,
      keyof IColors['info'],
    ];

    return themeColors[group][key];
  }

  const [group, key] = keys as [
    'primary' | 'secondary' | 'grey',
    keyof IColors['primary'] & keyof IColors['grey'],
  ];

  return themeColors[group][key];
};

import uniqid from 'uniqid';
import { clone } from './clone';

export const assignIds = (data: any): any => {
  data = { children: clone(data) };

  const run = (d: any): any => {
    if (typeof d.children !== 'undefined') {
      d.children = d.children.map((item: any) => {
        item.id = uniqid();
        return run(item);
      });
    }

    return d;
  };

  return run(data).children;
};

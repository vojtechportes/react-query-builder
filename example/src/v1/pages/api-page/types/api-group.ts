import type { IApiPage } from './api-page';

export interface IApiGroup {
  key: string;
  title: string;
  pages: IApiPage[];
}

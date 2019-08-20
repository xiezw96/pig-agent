import { GoodsCaterogy } from '@/interfaces';

export interface GoodsActionState {
  list: GoodsCaterogy[];
  keyword: string;
  goods: any;
}

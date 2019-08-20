import { Module } from 'vuex';

import { GoodsCaterogy } from '@/interfaces';
import { RootState } from '@/store';

import { GoodsActionState } from './goods';


export const goodsActionStore: Module<GoodsActionState, RootState> = {
  namespaced: true,
  state: {
    list: [],
    keyword: undefined,
    goods: undefined,
  },
  mutations: {
    set(state, categories: GoodsCaterogy[]) {
      state.list = categories;
    },
    setGoodsItem(state, goods: any) {
      state.goods = goods;
    },
    setSearchKey(state, keyword: string) {
      state.keyword = keyword;
    }
  },
};

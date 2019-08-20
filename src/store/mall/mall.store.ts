import { Module } from 'vuex';

import { fetchGoodsInCart, goodsService } from '@/services';
import { RootState } from '@/store';

export class MallState {
  goods: any[] = [];

  goodsInCart: any[] = [];
}

export const mallStore: Module<MallState, RootState> = {
  namespaced: true,
  state: new MallState(),
  mutations: {
    setGoods(state, payload) {
      state.goods = payload;
    },

    setGoodsInCart(state, payload) {
      state.goodsInCart = payload;
    },
  },
  actions: {
    async findAll(ctx) {
      const goods = await goodsService.find();
      ctx.commit('setGoods', goods);
    },

    async fetchGoodsInCart(ctx) {
      const goods = await fetchGoodsInCart();
      ctx.commit('setGoodsInCart', goods);
    },
  },
};

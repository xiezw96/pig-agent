import { Module } from 'vuex';

import { couponService } from '@/services';
import { RootState } from '@/store';


import { CouponState } from './coupon.state';

export const couponStore: Module<CouponState, RootState> = {
  namespaced: true,

  state: {
    list: [],
  },

  mutations: {
    set(state, list: any[]) {
      if (state.list) {
        state.list = state.list.concat(list);
      } else {
        state.list = list;
      }
    },
  },

  actions: {
    /**
     * 按查询条件优惠券
     */
    async search(context) {
      const data = await couponService.find();
      context.commit('set', data);
    },
  },
};

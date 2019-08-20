import { saleOrderService } from '@/services';
import { SearchOrder } from '@/services/saleorder/search-order.dto';
import { RootState } from '@/store';
import { concat } from 'lodash';
import { Module } from 'vuex';
import { OrderState } from './order.state';

export const orderStore: Module<OrderState, RootState> = {
  namespaced: true,

  state: {
    list: [],
    isMore: true,
  },

  mutations: {
    set(state, data: any) {
      if (data.total < data.current * data.size) {
        state.isMore = false;
      }
      if (!state.list) {
        state.list = concat(state.list, data.records);
      } else {
        state.list = data.records;
      }
    },
  },

  actions: {
    /**
     * 按查询条件收货地址
     */
    async searchOrder(context, playload: SearchOrder) {
      const data = await saleOrderService.getSaleOrder(playload);
      context.commit('set', data);
    },
  },
};

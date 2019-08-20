import { withdrawalService } from '@/services';
import { SearchOrder } from '@/services/saleorder/search-order.dto';
import { RootState } from '@/store';
import { concat } from 'lodash';
import { Module } from 'vuex';
import { WithdrawalState } from './withdrawal.state';

export const withdrawalStore: Module<WithdrawalState, RootState> = {
  namespaced: true,

  state: {
    list: [],
    withdrawalTotal: undefined,
  },

  mutations: {
    set(state, list: any[]) {
      if (!state.list) {
        state.list = concat(state.list, list);
      } else {
        state.list = list;
      }
    },
    setWithdrawalTotal(state, data) {
      state.withdrawalTotal = data;
    },
  },

  actions: {
    /**
     * 按查询条件收货地址
     */
    async search(context, playload: SearchOrder) {
      const data = await withdrawalService.getWithdrawalPage(playload);
      context.commit('set', data);
    },
    async getTotal(context) {
      const data = await withdrawalService.withdrawalPrice();
      context.commit(
        'setWithdrawalTotal',
        data.data === null ? '0' : data.data,
      );
    },
  },
};

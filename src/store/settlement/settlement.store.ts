import { settlementService } from '@/services';
import { SearchOrder } from '@/services/saleorder/search-order.dto';
import { RootState } from '@/store';
import { concat } from 'lodash';
import { Module } from 'vuex';
import { SettlementState } from './settlement.state';

export const settlementStore: Module<SettlementState, RootState> = {
  namespaced: true,

  state: {
    list: [],
    commission: 0,
    settlementPrice: 0,
    originalSettlementPrice: 0,
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
    setSettlementSum(state, data) {
      const { originalSettlementPrice, settlementPrice, commission } = data;
      state.originalSettlementPrice = originalSettlementPrice;
      state.settlementPrice = settlementPrice;
      state.commission = commission;
    },
  },

  actions: {
    /**
     * 按查询条件结算列表
     */
    async getTotal(context, playload: SearchOrder) {
      const data = await settlementService.settlementSum();
      context.commit('setSettlementSum', data.data);
    },
    async searchPage(context, playload: SearchOrder) {
      const data = await settlementService.getSettlementPage(playload);
      context.commit('set', data);
    },
  },
};

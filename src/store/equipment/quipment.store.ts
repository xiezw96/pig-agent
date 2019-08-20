import { Module } from 'vuex';

import { fetchEquipments } from '@/services';
import { RootState } from '@/store/root.state';

import { EquipmentState } from './equipment.state';

export const equipmentStore: Module<EquipmentState, RootState> = {
  namespaced: true,
  state: new EquipmentState(),
  mutations: {
    setEquipments(state, payload) {
      state.equipments = payload;
    },
  },
  actions: {
    async getEquipments(ctx) {
      const equipments = await fetchEquipments();
      ctx.commit('setEquipments', equipments);
    },
  },
};

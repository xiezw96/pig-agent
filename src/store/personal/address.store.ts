import { Module } from 'vuex';

import { addressService, CreateAddressDto } from '@/services';
import { RootState } from '@/store';


import { AddressState } from './address.state';

// const createAddressDto: CreateAddressDto | undefined = {};

export const addressStore: Module<AddressState, RootState> = {
  namespaced: true,

  state: {
    list: [],
  },

  mutations: {
    set(state, list: any[]) {
      state.list = list;
    },
  },

  actions: {
    /**
     * 按查询条件收货地址
     */
    async search(context) {
      const data = await addressService.find();
      context.commit('set', data.data.records);
    },

    /**
     * 添加收货地址
     */
    async create(context, category: CreateAddressDto) {
      await addressService.create(category);

      context.dispatch('search');
    },

    /**
     * 编辑收货地址
     */
    async update(context, { id, ...address }) {
      await addressService.update(id, address);

      context.dispatch('search');
    },
  },
};

import { Module } from 'vuex';

import { RootState } from '@/store';

import { PersonalState } from './personal.state';

import { addressStore } from './address.store';

import { couponStore } from './coupon.store';

export const personalStore: Module<PersonalState, RootState> = {
  namespaced: true,
  modules: {
    address: addressStore,
    coupon: couponStore,
  },
};

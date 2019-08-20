import { Module } from 'vuex';

import { RootState } from '@/store';

import { AccountState } from './account.state';
import { userStore } from './user.store';

export const accountStore: Module<AccountState, RootState> = {
  namespaced: true,
  modules: {
    user: userStore,
  },
};

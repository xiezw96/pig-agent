import { Module } from 'vuex';

import { RootState } from '@/store';

import { userStore } from './user.store';
import { WorkspaceState } from './workspace.state';

export const workspaceStore: Module<WorkspaceState, RootState> = {
  namespaced: true,
  modules: {
    user: userStore,
  },
};

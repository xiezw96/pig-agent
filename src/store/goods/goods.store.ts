import { RootState } from '@/store';
import { Module } from 'vuex';
import { deviceStore } from './device.store';
import { goodsActionStore } from './goods-action.store';
import { GoodsState } from './goods.state';
import { groupStore } from './group.store';

export const goodsStore: Module<GoodsState, RootState> = {
  namespaced: true,
  modules: {
    device: deviceStore,
    goods: goodsActionStore,
    group: groupStore,
  },
};

import { Store } from 'vuex';

import { equipmentStore } from './equipment';
import { mallStore } from './mall';
import { personalStore } from './personal';
// import { accountStore } from './account';
// import { goodsStore } from './goods';
import { RootState } from './root.state';
import { orderStore } from './saleorder';
import { settlementStore } from './settlement';
import { withdrawalStore } from './withdrawal';
// import { settingStore } from './setting';
import { workspaceStore } from './workspace';

export let rootStore: Store<RootState> = null;

/**
 * 延迟生成 Store 实例，避免在 Vuex 初始化完成前实例化
 */
export function buildStore() {
  if (!rootStore) {
    rootStore = new Store<RootState>({
      modules: {
        workspace: workspaceStore,
        personal: personalStore,
        saleOrder: orderStore,
        settlement: settlementStore,
        withdrawal: withdrawalStore,
        // account: accountStore,
        // goods: goodsStore,
        // setting: settingStore,
        mall: mallStore,
        equipment: equipmentStore,
      },
    });
  }

  return rootStore;
}

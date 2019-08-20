import { Component, Vue } from 'vue-property-decorator';

import { store } from '@/store';

@Component<EquipmentResoler>({
  render(h) {
    return h('router-view');
  },
  async beforeRouteEnter(_to, _from, next) {
    try {
      await store.dispatch('equipment/getEquipments');

      next();
    } finally {
      next(false);
    }
  },
})
export class EquipmentResoler extends Vue {}

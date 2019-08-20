import { Component, Mixins } from 'vue-property-decorator';

import { RouteGroupComponent } from '@/components/route-group.component';
import { store } from '@/store';

@Component<ActivedGuard>({
  beforeRouteEnter(_to, _from, next) {
    const { activeStatus } = store.state.workspace.user.agentInfo;
    if (activeStatus === 1) {
      next();
      return;
    }

    next({ name: '激活套餐' });
  },
  render(h) {
    return h('router-view');
  },
})
export class ActivedGuard extends Mixins(RouteGroupComponent) {}

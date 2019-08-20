import { Component, Mixins } from 'vue-property-decorator';

import { RouteGroupComponent } from '@/components/route-group.component';
import { agentService } from '@/services';
import { store } from '@/store';

@Component<ProtectedGuard>({
  async beforeRouteEnter(_to, _from, next) {
    if (store.getters['workspace/user/logined']) {
      const agent = await agentService.get();
      store.commit('workspace/user/setAgentInfo', agent);
      next();
    } else {
      next({ name: '登陆' });
    }
  },
})
export class ProtectedGuard extends Mixins(RouteGroupComponent) {}

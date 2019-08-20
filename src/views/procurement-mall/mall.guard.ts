import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { goodsService } from '@/services';

const Mall = namespace('mall');

@Component<MallGuard>({
  async beforeRouteEnter(_to, _from, next) {
    const goods = await goodsService.find();

    next(vm => {
      vm.setGoods(goods);
    });
  },
  render(h) {
    return h('router-view');
  },
})
export class MallGuard extends Vue {
  @Mall.Mutation
  setGoods: (payload: any[]) => void;
}

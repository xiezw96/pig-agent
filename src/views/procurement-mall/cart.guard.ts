import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { fetchGoodsInCart } from '@/services';

const Mall = namespace('mall');

@Component<CartGuard>({
  async beforeRouteEnter(_to, _from, next) {
    const goods = await fetchGoodsInCart();

    next(vm => {
      vm.setGoodsInCart(goods);
    });
  },
  render(h) {
    return h('router-view');
  },
})
export class CartGuard extends Vue {
  @Mall.Mutation
  setGoodsInCart: (payload: any[]) => void;
}

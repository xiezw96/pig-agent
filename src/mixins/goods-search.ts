import { groupBy } from 'lodash';
import { Component, Vue } from 'vue-property-decorator';

import { goodsService } from '@/services';

@Component
export default class GoodsSearchMixin extends Vue {
  data = null;

  current = null;
  searchValue = '';

  totalCount = null;

  async getAllGoods(dto?: any) {
    const loading = this.loading();
    const result = await goodsService.find(dto);
    this.totalCount = result.length;
    loading.hide();
    return this.formatGoods(result);
  }

  formatGoods(records: any) {
    const forArray = groupBy(records, 'categoryName');
    const list = Object.values(forArray);
    const goods = list.map(item => {
      return {
        name: item[0].categoryName,
        categoryId: item[0].category,
        goods: item,
      };
    });
    this.data = goods;
    if (this.data) {
      this.current = this.data[0].name;
    }
  }

  private loading() {
    return this.$createToast({
      time: 0,
      txt: '正在加载...',
    }).show();
  }
}

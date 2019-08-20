<template>
  <div class="card">
    <div class="row">
      <div>商品名称</div>
      <div>{{ goods.goodsName }}</div>
    </div>
    <div class="row">
      <div>规格</div>
      <div>{{ [goods.goodsSpe1, goods.goodsSpe2] | spec }}</div>
    </div>
    <div class="row">
      <div>数量</div>
      <div>{{ goods.num }}</div>
    </div>
    <div class="row">
      <div>统批价/零售价</div>
      <div>{{ goods.tradePrice }}/{{ goods.salePrice }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';

@Component
export default class GoodsInfoComponent extends Vue {
  @Prop()
  goods: any;
}
</script>

<style lang="stylus" scoped>
.row
  display flex
  padding 0 8px
  line-height 1.7
  font-size 14px
  justify-content space-between
</style>


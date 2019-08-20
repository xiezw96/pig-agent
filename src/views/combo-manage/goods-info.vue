<template>
  <div class="card mdc-elevation--z2">
    <div class="card-row detail">
      <div class="detail-image">
        <div
          class="image"
          :style="{ backgroundImage: `url(${atob(goods.goodsAttId)})` }"
        ></div>
      </div>
      <div class="detail-info">
        <div class="detail-info-row title">
          <div>{{ goods.goodsName }}</div>
        </div>
        <div class="detail-info-row">
          <div>{{ [goods.sepcValue1, goods.sepcValue2] | spec }}</div>
          <div>数量：{{ goods.goodNum }}</div>
        </div>
        <div class="detail-info-row">
          <div>采购价：{{ goods.tradePrice }}</div>
          <div>零售价：{{ goods.salePrice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class GoodsInfoComponent extends Vue {
  @Prop()
  goods: any;

  atob(base64) {
    if (typeof base64 !== 'string') return;
    return atob(base64);
  }
}
</script>
<style lang="stylus" scoped>
.card + .card
  margin-top 8px

.card
  background-color #fff
  border-radius 2px
  text-align left
  font-size 12px

.card-row
  display flex
  justify-content space-between
  padding 0 8px
  line-height 2.4

  + .card-row
    border-top 1px solid #ddd

.card-row.detail
  padding 8px
  line-height 2.4

  .detail-image
    flex none

  .detail-info
    flex auto
    margin-left 16px
    line-height 1.5

  .detail-info-row
    display flex
    justify-content space-between

.detail-image
  width 100px
  background-color #ddd

  .image
    padding-top 60%
    background center / contain no-repeat
</style>


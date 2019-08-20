<template>
  <div style="text-align: left;">
    <goods-info
      v-for="goods in list"
      :key="goods.id"
      :goods="goods"
    ></goods-info>
    <div style="margin-top: 16px;">赠送柜子：</div>
    <div style="margin-left: 6%;line-height: 33px;" v-for="(item, index) in combo.machineList" :key="index">
      <span>型号名称:{{ item.machineSpecName }}</span>
      <span style="float: right;margin-right: 6px;">数量:{{ item.num }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import GoodsInfo from './goods-info.vue';

@Component({
  components: {
    GoodsInfo,
  },
})
export default class Goods extends Vue {
  @Prop()
  combo: any;

  get list() {
    return this.combo.detailList;
  }
}
</script>
<style lang="stylus" scoped>
@import '../../assets/css/goods.styl'

.indexList
  background-color #fff
  padding-top 5px

.data-item
  display flex
  height 42px
  align-items center
  font-size 14px
  padding 2px 0 0 10px

.left
  text-align left
  width 50%

.right
  width 50%
  text-align right
  padding-right 3%

.indexContent
  border-bottom 1px solid #efeff4

  ul
    font-size 13px

    li
      width 100%
      line-height 26px
      border-top 1px solid #efeff4
      display flex

      .left
        padding-left 4%

.view-wrapper
  position fixed
  top 102px
  left 0
  bottom 0
  width 100%

  .index-list-wrapper
    height 98%
    width 94%
    margin 0 auto
    overflow hidden

    &.custom
      .cube-index-list-content, .cube-index-list-group
        padding-bottom 0px

.cube-index-list-item
  border-top 6px solid #efeff4

.cube-index-list-item_active
  background #fff
</style>

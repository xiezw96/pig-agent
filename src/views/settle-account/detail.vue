<template>
  <cube-page title="结算明细">
    <template #content>
      <div class="view-wrapper">
        <div class="index-list-wrapper custom">
          <cube-index-list ref="indexList" :navbar="false">
            <cube-index-list-item
              v-for="(item, index) in singerData"
              :key="index"
              :item="item"
            >
              <div class="indexContent">
                <div class="orderCode">
                  <span class="left">订单号:{{ item.orderCode }}</span>
                </div>
                <div class="data-item">
                  <span class="left">日期 : {{ reqTime | date }}</span>
                  <span class="right"
                    >归属: {{ item.source | sourceStatus }}</span
                  >
                </div>
                <div class="goods-item">
                  <span class="pic">
                    <img class="avatar" :src="getImage(item)" />
                  </span>
                  <div class="goods-content">
                    <span class="goodsTitle">{{ item.goodName }}</span>
                    <div class="goods-content-detail">
                      <span class="goodsLeft"
                        >{{ item.goodsSpe1 }}-{{ item.goodsSpe2 }}</span
                      >
                      <span class="goodsRight">数量: {{ item.payNum }}</span>
                    </div>
                    <div class="goods-content-detail">
                      <span class="goodsLeft"
                        >采购价：{{ item.tradePrice }}</span
                      >
                      <span class="goodsRight"
                        >零售价：{{ item.salePrice }}</span
                      >
                    </div>
                  </div>
                </div>
                <ul>
                  <li>
                    <span class="left">订单总金额</span>
                    <span class="right">{{ item.orderTotal }}</span>
                  </li>
                  <li>
                    <span class="left">利润价格</span>
                    <span class="right">{{
                      Number(item.salePrice - item.tradePrice).toFixed(2)
                    }}</span>
                  </li>
                  <li>
                    <span class="left">抽成比例</span>
                    <span class="right">{{ Number(item.shareProfit) * 100 }}%</span>
                  </li>
                  <li>
                    <span class="left">结算金额</span>
                    <span class="right">{{ item.settlementPrice }}</span>
                  </li>
                </ul>
              </div>
            </cube-index-list-item>
          </cube-index-list>
        </div>
      </div>
    </template>
  </cube-page>
</template>

<script lang="ts">
import Vue from 'vue';
import CubePage from '@/components/cube-page.vue';
import { find, get } from 'lodash';
import { settlementService } from '@/services';

export default Vue.extend({
  name: 'settle-account-detail',
  components: {
    CubePage,
  },
  created() {
    const params = this.$route.params;
    if (!params) return;
    this.getSettlementDetail(params);
  },
  data(this: any) {
    return {
      singerData: [],
      reqTime: undefined,
    };
  },
  methods: {
    async getSettlementDetail(params: any) {
      const data = await settlementService.getSettlementDetail({
        settlementId: params.id,
      });
      this.singerData = data.records;
    },
    getImage(item) {
      if (item.goodsAttId) return atob(item.goodsAttId);
    },
  },
});
</script>

<style lang="stylus" scoped>
@import '../../assets/css/goods.styl'

.indexList
  background-color #fff
  padding-top 5px

.grand-item
  height 30px
  align-items center
  text-align left
  padding 12px 0 0 8px
  border-bottom 1px solid #efeff4

  .status
    float right
    padding-right 2%
    font-size 14px

.orderCode
  display flex
  height 30px
  align-items center
  // background-color: #efeff4;
  padding 5px 0 0 10px

  .left
    text-align left
    width 90%

.data-item
  display flex
  height 25px
  align-items center
  font-size 12px
  padding 2px 0 0 10px
  // background-color: #e0dede

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
      line-height 30px
      border-top 1px solid #efeff4
      display flex

      .left
        padding-left 4%

.view-wrapper
  position fixed
  top 46px
  left 0
  bottom 0
  width 100%

  .index-list-wrapper
    height 98%
    width 94%
    margin 0 auto
    overflow hidden

    &.custom
      .cube-index-list-content
        // background-color: #222
        // color: #909090

      .cube-index-list-group
        padding-bottom 0px

.cube-index-list-item
  border-top 6px solid #efeff4

.cube-index-list-item_active
  background #fff

.goods-item
  display flex
  height 100px
  align-items center
  font-size 12px
  padding 2px 0 0 10px

.pic
  text-align left
  width 30%

  .avatar
    width 100%
    height 65px
    margin-bottom 12px
</style>

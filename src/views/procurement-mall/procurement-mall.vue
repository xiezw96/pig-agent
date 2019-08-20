<template>
  <cube-page type="scroll-nav-side" title="采购商城">
    <i slot="rightExtAction" class="cubeic-mall" @click="goCart"></i> 
    <template #content>
      <div class="container">
        <div style="flex: none; display: flex; align-items: center;">
          <div style="flex: auto;">
            <cube-input v-model="searchValue" placeholder="请输入查询关键字">
            </cube-input>
          </div>
          <div style="flex: none;">
            <cube-button :inline="true" type="button" @click="onSearch()">
              查询
            </cube-button>
          </div>
        </div>
        <div style="flex: none; display: flex; padding-top: 4px;">
          <cube-button style="width:23%" :outline="true" @click="synthesize">
            综合
          </cube-button>
          <cube-button style="width:23%" :outline="true" @click="profit">
            利润
          </cube-button>
          <cube-button style="width:23%" :outline="true" @click="price">
            价格
          </cube-button>
          <cube-button style="width:23%" :outline="true" @click="newest">
            最新
          </cube-button>
        </div>
        <cube-scroll-nav
          class="reset-nav-side-width"
          style="flex: auto; margin-top: 10px;"
          :side="true"
          :data="data"
          :current="current"
          @change="changeHandler"
          @sticky-change="stickyChangeHandler"
        >
          <cube-scroll-nav-panel
            v-for="item in data"
            :key="item.name"
            :label="item.name"
            :title="item.name"
          > 
            <ul>
              <li
                v-for="(goods, index) in item.goods"
                :key="index"
                @click="onView(goods)"
              >
                <div style="border: 1px solid #efeff4;">
                  <img :src="getImage(goods)" />
                  <p>{{ goods.name }}</p>
                  <div class="goodsPrice">
                    <span class="left">
                      批价:{{ getTradePrice(goods.sepPriceList) }}
                    </span>
                    <span class="right">
                      {{ getSalePrice(goods.sepPriceList) }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </cube-scroll-nav-panel>
        </cube-scroll-nav>
      </div>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { get } from 'lodash';
import { Mixins, Component } from 'vue-property-decorator';

import CubePage from '@/components/cube-page.vue';
import { GoodsSearch } from '@/mixins';

@Component<ProcurementMall>({
  components: {
    CubePage,
  },
  created(this: ProcurementMall) {
    this.getAllGoods();
  },
})
export default class ProcurementMall extends Mixins(GoodsSearch) {
  onSearch() {
    let dto;
    if (this.searchValue) {
      dto = { name: this.searchValue };
    }
    this.getAllGoods(dto);
  }

  onView(item: any) {
    (this as any).$router.push({
      name: 'procurementMallDetail',
      params: { ...item },
    });
  }

  async synthesize() {
    await this.getAllGoods();
  }

  async profit() {
    await this.getAllGoods();
  }

  async price() {
    await this.getAllGoods();
  }

  async newest() {
    await this.getAllGoods({descs: 'goods.update_time'});
  }

  getTradePrice(spec) {
    return get(spec, '0.tradePrice');
  }

  getSalePrice(spec) {
    return get(spec, '0.salePrice');
  }

  getImage(goods) {
    const base64 = get(goods, 'picList.0.attId');
    if (base64) return atob(base64);
  }

  changeHandler(label) {
  }
  stickyChangeHandler(current) {
  }
  
  goCart(){
    this.$router.push({ name: 'procurementMallOrder' });
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@require "~@/theme.styl"

.container
  display flex
  flex-direction column
  height 100%

.reset-nav-side-width >>> .cube-sticky-content
  width 86px

.cube-scroll-nav-bar
  width 86px
  background-color transparent

.reset-nav-side-width > .cube-sticky > .cube-sticky-fixed
  width 24%

.scroll-nav-side
  background-color #fff

  .cube-scroll-nav-main
    background-color #efeff4


  .cube-scroll-nav-bar-item
    padding 15px

  .cube-scroll-nav-bar-item_active
    background-color #fff

  .cube-scroll-nav-panels
    background-color #fff

  .cube-scroll-nav-panel
    img
      width 114px
      height 114px

    ul
      overflow hidden
      font-size 14px
      line-height 1.4
      color #666

    li
      float left
      width 49.3%
      height 214px
      padding-top 3%

      div
        width 90%
        padding-top 5%
        margin auto

        p
          font-size 14px
          line-height 20px
          height 40px
          display -webkit-box
          -webkit-box-orient vertical
          -webkit-line-clamp 2
          overflow hidden

  .cube-scroll-nav-panel-title
    padding 15px
    font-size 16px
    background-color #fff

.goodsPrice
  display flex
  line-height 38px

  .left
    text-align left
    width 122px
    font-size 12px

  .right
    text-align right
    width 63px
    font-size 16px
    color $primary-color

.cube-input::after
  border-radius 50px !important

.cube-btn-inline
  padding 10px 10px !important

.cube-btn
  padding 5px
  margin 0px 6px

.cube-btn-outline::after
  border-radius 50PX

.cube-scroll-wrapper
  top 2px

.cube-input-field
  padding 6px
</style>

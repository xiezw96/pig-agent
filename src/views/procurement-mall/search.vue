<template>
  <cube-page type="scroll-nav-side" title="">
    <div slot="titleArea" style="padding-top: 6px;width: 70%;padding-left: 20%;">
      <cube-input v-model="searchValue" placeholder="请输入查询关键字">
      </cube-input>
    </div>
    <div slot="content">
      <div style="text-align: left;font-size: 13px;">共为您找到<font style="color:#ff0a0a">{{totalCount}}</font>件商品</div>
      <div class="view-wrapper">
        <div class="index-list-wrapper">
          <cube-index-list ref="indexList" :data="data" :navbar="false" :options="indexListOptions">
            <cube-index-list-group v-for="(item, index) in data" :key="index"  >
              <cube-index-list-item v-for="(detail, index) in item.goods" :key="index" :item="item" @select="checkItem">
                    <div class="product-content">
                      <div class="product-img">
                        <img :src="detail.icon" style="width: 168px;height: 168px;opacity: 1;">
                      </div>
                      <span class="product-title">{{detail.name}}</span>
                      <div class="goodsPrice">
                        <span class="left">批价:￥2000</span>
                        <span class="right">￥5000</span>
                      </div>
                    </div>
              </cube-index-list-item>
            </cube-index-list-group>
          </cube-index-list>
        </div>
      </div>
    </div>
  </cube-page>
</template>

<script lang="ts">
import Vue from 'vue';

import CubePage from '@/components/cube-page.vue'

import { GoodsSearch } from '@/mixins';
export default Vue.extend({
  name: 'procurement-mall-search',
  components: {
    CubePage
  },
  mixins: [GoodsSearch],
  data() {
    return {
      indexListOptions: {
        pullUpLoad: false
      },
    }
  },
  async created() {
    const params = this.$route.params;
    if(params) {
      this.searchValue = params.keyword;
    }
    const result = await this.getAllGoods({name: this.searchValue});
  },
  methods: {
    onPullingUp() {
      console.log('加载更多...');
    }
  }
});
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.wrapper
  background-color: #fff;
.cube-input
  background-color: #edf0f4 !important;
.view-wrapper
  position: fixed
  top: 72px !important;
  left: 0
  bottom: 0
  width: 100%
  .index-list-wrapper
    margin: 0 auto
    overflow: hidden
    &.custom
      .cube-index-list-content
        // background-color: #222
        // color: #909090
      .cube-index-list-group
        padding-bottom: 0px
.product-li
  float: left;
  width: 50%;
  box-sizing: border-box;
  padding-bottom: 4px;
  position: relative;
.product-content
  position: relative;
  border: 2px solid #efeff4;
  box-sizing: border-box;
  // padding: 5% 5% 0% 5%;
  width: 100%;
  margin: auto;
.product-img
  position: relative;
.product-title
  box-sizing: border-box;
  height: 40px;
  line-height: 20px;
  font-size: 13px;
  overflow: hidden;
  width: 164px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  color: #232326;
  margin-top: 5px;
  margin-bottom: 3px;
  padding: 0 4px;
  span
    font-size: 14px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
.goodsPrice
  display: flex;
  padding-bottom: 4px;
  .left
    text-align: left;
    padding-left: 4%;
    width: 60%;
    font-size: 12px;
  .right
    text-align: right;
    font-size: 16px;
    width: 40%;
    padding-right: 10px;
    color: #ff0a0a;
.cube-index-list-item
  border-top: 0px !important;
  float: left;
  padding: 2px;
.cube-input::after
  border: 1PX solid #ad9a9a;
.cube-index-list-fixed
  display: none;
</style>

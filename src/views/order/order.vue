<template>
  <cube-page title="订单查询">
    <template #rightExtAction>
      <i class="cubeic-search" @click="onShowSearchForm"></i>
    </template>
    <template #content>
      <cube-scroll style="height: 100%;">
        <div v-for="(item, index) in list" :key="index" class="index-content">
          <div class="order-code">订单号：{{ item.orderCode }}</div>
          <div class="data-item">
            <span class="left">商品编码 :{{ item.goodsCode }}</span>
            <span class="right">归属: {{ item.source }}</span>
          </div>
          <div class="goods-item">
            <span class="pic">
              <img class="avatar" :src="getImage(item)" />
            </span>
            <div class="goods-content">
              <span class="goods-title">
                {{ item.goodsName }}
              </span>
              <div class="goods-content-detail">
                <span class="goods-left">
                  {{ [item.goodsSpe1, item.goodsSpe2] | spec }}
                </span>
                <span class="goods-right"> 数量: {{ item.payNum }} </span>
              </div>
              <div class="goods-content-detail">
                <span class="goods-left"> 采购价：{{ item.tradePrice }} </span>
                <span class="goods-right"> 零售价：{{ item.salePrice }} </span>
              </div>
            </div>
          </div>
          <div class="other">
            <div>柜子编码：{{ item.machineCode }}</div>
            <div>当前地址：{{ item.machineCurrAddress }}</div>
            <div>买家帐号：{{ item.userAccount }}</div>
            <div>订单日期：{{ item.orderCreateTime }}</div>
            <div>订单总额：{{ item.totalMoney }}</div>
          </div>
        </div>
      </cube-scroll>

      <cube-popup
        type="search-form-popup"
        position="bottom"
        maskClosable
        ref="searchFormPopup"
      >
        <cube-form
          :model="searchForm"
          :schema="schema"
          :style="{ textAlign: 'left' }"
        ></cube-form>
      </cube-popup>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { Popup } from 'cube-ui';
import {
  subWeeks,
  subMonths,
  startOfHour,
  startOfMinute,
  startOfSecond,
} from 'date-fns';
import { omitBy, isNil, cloneDeep } from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';
import DateRangePickerComponent from '@/components/date-range-picker.vue';
import { saleOrderService } from '@/services';
import { format, startOfDay, endOfDay } from 'date-fns';
import { DATE_FORMAT } from '../../constants';
import { SourceStatus } from '../../enums';

const Order = namespace('saleOrder');

const initFormValues = {
  goodsCode: '',
  goddsName: '',
  machineCode: '',
  source: -1,
  orderCode: '',
  createDate: [subMonths(new Date(), 1), new Date()],
};

@Component({
  components: {
    CubePage,
  },
  async created() {
    this.getSaleOrder();
  },
})
export default class OrderComponent extends Vue {
  searchForm = {
    ...initFormValues,
  };

  schema = {
    fields: [
      {
        type: 'input',
        modelKey: 'goodsCode',
        label: '商品编码/名称',
        props: {
          type: 'text',
          placeholder: '全部',
        },
      },
      {
        type: 'input',
        modelKey: 'machineCode',
        label: '柜子编码/名称',
        props: {
          placeholder: '全部',
        },
      },
      {
        type: 'select',
        modelKey: 'source',
        label: '订单归属',
        props: {
          options: [
            { value: -1, text: '全部' },
            { value: 0, text: '自有' },
            { value: 1, text: '商城' },
            { value: 2, text: '下级' },
          ],
          placeholder: '全部',
        },
      },
      {
        type: 'input',
        modelKey: 'orderCode',
        label: '订单编号',
        props: {
          placeholder: '全部',
        },
      },
      {
        component: DateRangePickerComponent,
        modelKey: 'createDate',
        label: '订单日期',
        props: {
          clearable: true,
          placeholder: '全部',
        },
      },
      {
        label: '查询',
        type: 'submit',
        events: {
          click: this.onSearch,
        },
      },
    ],
  };

  $refs: {
    searchFormPopup: Popup;
  };

  @Order.State
  list: any[];

  @Order.State
  isMore: boolean;

  @Order.Action
  searchOrder: (payload) => Promise<void>;

  async getSaleOrder() {
    const { createDate, source, ...rest } = this.searchForm;
    const dto: any = { ...rest };
    if (createDate.length === 2) {
      const [start, end] = createDate;
      dto.orderCreateStartTime = format(
        startOfDay(start),
        DATE_FORMAT.POPULAR_DATETIME,
      );
      dto.orderCreateEndTime = format(
        endOfDay(end),
        DATE_FORMAT.POPULAR_DATETIME,
      );
    }
    if (Number.isFinite(source)) {
      dto.source = source;
    }

    await this.searchOrder(dto);
  }

  onShowSearchForm() {
    this.searchForm = cloneDeep(initFormValues);
    this.$refs.searchFormPopup.show();
  }

  onSearch(e: any) {
    this.$refs.searchFormPopup.hide();
    this.getSaleOrder();
  }

  getImage(item) {
    if (item.goodsAttId) return atob(item.goodsAttId);
  }
}
</script>

<style lang="stylus" scoped>
@require '~@/theme.styl'

.index-content
  background-color #fff
  border-radius $border-radius

  + .index-content
    margin-top 8px

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

.order-code
  font-size 12px
  line-height 1.7
  padding 0.5em 10px
  border-bottom 1px solid rgba(0, 0, 0, 0.1)
  text-align left
  background-color $secondary-color
  border-top-left-radius $border-radius
  border-top-right-radius $border-radius

.data-item
  display flex
  height 25px
  align-items center
  font-size 14px
  padding 0 10px

.left
  width 50%
  text-align left

.right
  width 50%
  text-align right

.goods-item
  display flex
  align-items center
  font-size 12px
  padding 0 10px

.pic
  text-align left
  width 30%

  .avatar
    width 100%
    height 65px
    vertical-align middle

.goods-content
  width 70%
  padding-left 2%
  text-align left

  .goods-title
    font-size 14px
    line-height 18px

  .goods-content-detail
    width 100%
    display flex
    line-height 1.5

    .goods-left
      width 50%
      text-align left

    .goods-right
      width 50%
      text-align right

.other
  padding 0 10px
  font-size 12px
  line-height 1.5
  text-align left
</style>

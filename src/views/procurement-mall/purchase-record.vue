<template>
  <cube-page title="采购记录" :showBack="false">
    <i @click="back" class="cubeic-back" slot="left-area"></i>
    <template slot="content">
      <div class="container">
        <cube-form class="static" :model="model">
          <cube-form-group>
            <cube-form-item :field="searchFields[0]"></cube-form-item>
          </cube-form-group>
        </cube-form>
        <app-spacer></app-spacer>
        <cube-scroll style="height: 100%;" class="expand">
          <div
            v-for="(item, index) in records"
            :key="index"
            class="indexContent"
          >
            <div class="data-item">
              <span class="left">采购日期：{{ item.createTime }}</span>
              <span class="right">总金额：{{ item.totalMoney }}</span>
            </div>
            <div
              class="goods-item"
              v-for="(goodsItem, index) in item.orderDetails"
              :key="index"
            >
              <span class="pic">
                <img class="avatar" :src="goodsItem.goodsAttId | b64toUrl" />
              </span>
              <div class="goods-content">
                <span class="goodsTitle">{{ goodsItem.goodsName }}</span>
                <div class="goods-content-detail">
                  <span class="goodsLeft">
                    {{ [goodsItem.goodsSpe1, goodsItem.goodsSpe2] | join }}
                  </span>
                  <span class="goodsRight"> 数量: {{ goodsItem.payNum }} </span>
                </div>
                <div class="goods-content-detail">
                  <span class="goodsLeft">
                    采购价：{{ goodsItem.tradePrice }}
                  </span>
                  <span class="goodsRight">
                    零售价：{{ goodsItem.salePrice }}
                  </span>
                </div>
              </div>
            </div>
            <div class="payButton" v-if="item.payStatus !== 1">
              <cube-button :inline="true" @click="goDelete(item)" style="margin-right: 10px;">删除</cube-button>
              <cube-button :inline="true" @click="goPay(item)">去支付</cube-button>
            </div>
          </div>
        </cube-scroll>
      </div>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { format, startOfDay, endOfDay } from 'date-fns';
import { find } from 'lodash';
import { Component, Vue, Mixins } from 'vue-property-decorator';

import CubePage from '@/components/cube-page.vue';
import { DateSegment, WxPay } from '@/mixins';
import { fetchProcurementOrders, removeOrder } from '../../services';
import DateRangePickerComponent from '@/components/date-range-picker.vue';
import { namespace } from 'vuex-class';
import { debounce } from 'rxjs/operators';

@Component<PurchaseRecordComponent>({
  components: {
    CubePage,
  },
  async created() {
    const params = this.$route.params;
    if (params) {
      this.fromPage = params.form;
    }
    this.getProcurementOrder();
  },
})
export default class PurchaseRecordComponent extends Mixins(
  DateSegment,
  WxPay,
) {
  records: any[] = [];

  fromPage: any = '';

  model = {
    dateRange: [],
  };

  searchFields = [
    {
      component: DateRangePickerComponent,
      modelKey: 'dateRange',
      label: '采购日期',
      props: {
        clearable: true,
        placeholder: '全部',
      },
      events: {
        input: this.onChangeDateRange,
      },
    },
  ];
  back() {
    if (this.fromPage) {
      this.$router.push({ name: 'procurementMall' });
      return;
    }
    this.$router.back();
  }

  async onChangeDateRange(e: any) {
    const [start, end] = e;

    const dto: any = {};

    if (e.length === 2) {
      dto.createStartTime = format(startOfDay(start), 'YYYY-MM-DD HH:mm:ss');

      dto.createEndTime = format(endOfDay(end), 'YYYY-MM-DD HH:mm:ss');
    }

    this.getProcurementOrder(dto);
  }

  async getProcurementOrder(dto?: any) {
    this.records = await fetchProcurementOrders(dto);
  }


  async goPay(item: any) {
    const loading = this.loading();
    try {
      const data = await this.unifiedorder(item.code);
      const result: any = await this.wxPay(data);
      if (result.errMsg === 'chooseWXPay:ok') {
        this.records = await fetchProcurementOrders();
      }
    } catch (error) {
    } finally {
      loading.hide();
    }
  }

  async goDelete(item: any) {
    const loading = this.loading();
    try {
      await removeOrder(item.code);
      this.getProcurementOrder();
    } catch (error) {
    } finally {
      loading.hide();
    }
  }


  private loading() {
    return this.$createToast({
      time: 0,
      txt: '提交中',
    }).show();
  }
}
</script>

<style lang="stylus" scoped>
@require '~@/theme.styl'
@import '../../assets/css/goods.styl'

.data-item
  display flex
  height 42px
  align-items center
  font-size 14px
  padding 2px 0 0 10px
  background-color $secondary-color
  border-top-left-radius $border-radius
  border-top-right-radius $border-radius

.left
  flex auto
  text-align left

.right
  flex auto
  text-align right
  padding-right 3%

.indexContent
  border-bottom 1px solid #efeff4
  background-color #fff
  margin-bottom 6px
  border-radius $border-radius

.container
  display flex
  flex-direction column
  height 100%

  .static
    flex none
    border-radius $border-radius

  .expand
    flex auto

.payButton
  text-align right
  padding-right 3%
  padding-bottom 3%

.left-area, .right-area
  display flex
  align-items center
  font-size 120%

.left-area
  height 100%
  flex 1 1 30%
  text-align left
</style>


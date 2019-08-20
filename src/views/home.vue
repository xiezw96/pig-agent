<template>
  <cube-page :showBack="false" title="首页">
    <template #rightExtAction>
      <i @click="clickHandler('personalCenter')" class="cubeic-person"></i>
    </template>
    <template slot="content" class="home-content">
      <div style="padding-top: 10px;">
        <span class="item-title">经营状况</span>
        <div class="chart-area">
          <div style="width: 50%; position: relative;">
            <div v-if="!showWaterChart" class="nochart">
              暂无数据
            </div>
            <canvas
              id="waterChart"
              style="width: 100%; height: 130px;"
            ></canvas>
          </div>
          <div style="width: 50%; position: relative;">
            <div v-if="!showOrderChart" class="nochart">
              暂无数据
            </div>
            <canvas
              id="orderChart"
              style="width: 100%; height: 130px;"
            ></canvas>
          </div>
        </div>
      </div>
      <div style="padding-top: 12px;">
        <span class="item-title">资产状况</span>
        <div class="item-content fund">
          <ul style="width:100%">
            <li class="title">
              我的资金：
            </li>
            <li>
              <span class="left-content">{{ withdrawalTotal }}</span>
              <span
                class="right-content"
                @click="clickHandler('withdrawDeposit')"
                >提现<i class="cubeic-arrow"></i
              ></span>
            </li>
          </ul>
        </div>
        <div class="item-content fund">
          <ul style="width:100%">
            <li class="title">
              可结算金额：
            </li>
            <li>
              <span class="left-content">{{ originalSettlementPrice }}</span>
              <span class="right-content" @click="clickHandler('settleAccount')"
                >结算<i class="cubeic-arrow"></i
              ></span>
            </li>
          </ul>
        </div>
      </div>
      <div style="padding-top: 12px;">
        <span class="item-title">快捷入口</span>
        <div class="box">
          <cube-tab-bar v-for="(tab, index) in tabs" :key="index"
            v-model="selectedLabel"
            :inline="false"
            @click="clickHandler"
          >
            <cube-tab class="tabItem"
              v-for="(item, index) in tab"
              :value="item.value"
              :label="item.label"
              :key="index"
            >
              <div slot="icon" :class="item.value"></div>
              {{ item.label }}
            </cube-tab>
          </cube-tab-bar>
        </div>
      </div>
    </template>
  </cube-page>
</template>

<script lang="ts">
import F2 from '@antv/f2/lib/core';

import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';
import { currentUserService, fetchReport } from '@/services';
import { isAfter, subMinutes, differenceInMinutes } from 'date-fns';

const User = namespace('workspace/user');
const Settlement = namespace('settlement');
const Withdrawal = namespace('withdrawal');

@Component<HomeComponent>({
  beforeCreate() {
    this.refreshLocked = false;
    this.refreshTime = setInterval(async () => {
      if (!this.accessToken) return;
      // 如果 Token 过期时间 - 当前时间 > 15分钟，则不刷新 Token
      if (differenceInMinutes(this.expiresIn, new Date()) > 15) return;
      if (this.refreshLocked) return;
      this.refreshLocked = true;
      const data = await currentUserService.refreshToken(this.refreshToken!);
      this.setTokenInfo(data);
      this.refreshLocked = false;
    }, 5000);
  },
  components: {
    'cube-page': CubePage,
  },
  created() {
    this.getSettlementTotal();
    this.getWithdrawalTotal();
    fetchReport().then(data => {
      this.report = data;
      this.drawWaterChart();
      this.drawOrderChart();
    });
  },
})
export default class HomeComponent extends Vue {
  refreshTime: number;

  refreshLocked: boolean;

  report = null;

  @User.State
  accessToken: string | null;

  @User.State
  agentInfo: any;

  @User.State
  refreshToken: string | null;

  @User.State
  expiresIn: Date | null;

  @User.Mutation
  setTokenInfo: (payload: any) => void;

  @Settlement.Action('getTotal') getSettlementTotal;
  @Withdrawal.Action('getTotal') getWithdrawalTotal;

  @Settlement.State
  originalSettlementPrice: number;

  @Withdrawal.State
  withdrawalTotal: number | 0;

  waterChart: any;
  orderChart: any;

  get water() {
    if (!this.report) return;

    const { todaySaleStatement, yesterdaySaleStatement } = this.report;

    return [
      {
        amount: todaySaleStatement,
        memo: '今日流水',
        const: 'const',
      },
      {
        amount: yesterdaySaleStatement,
        memo: '昨日流水',
        const: 'const',
      },
    ];
  }

  get showWaterChart() {
    if (!this.report) return false;
    const { todaySaleStatement, yesterdaySaleStatement } = this.report;
    return todaySaleStatement + yesterdaySaleStatement > 0;
  }

  get order() {
    if (!this.report) return;

    const { todayOrderNum, yesterdayOrderNum } = this.report;

    return [
      {
        amount: todayOrderNum,
        memo: '今日订单',
        const: 'const',
      },
      {
        amount: yesterdayOrderNum,
        memo: '昨日订单',
        const: 'const',
      },
    ];
  }

  get showOrderChart() {
    if (!this.report) return false;
    const { todayOrderNum, yesterdayOrderNum } = this.report;
    return todayOrderNum + yesterdayOrderNum > 0;
  }

  testModel: TesetModel = {
    name: 'name',
    label: 'label',
  };
  selectedLabel: string = '公告';
  tabs: any[] = [
    [
      {
        label: '采购商城',
        value: 'procurementMall',
      },
      {
        label: '我的柜子',
        value: 'equipment',
      },
      {
        label: '柜子商品',
        value: 'equipmentGoods',
      },
      {
        label: '订单查询',
        value: 'order',
      },
    ],
    [
      {
        label: '采购记录',
        value: 'procurementMallRecord',
      },
      {
        label: '发展收益',
        value: 'developEamrnings',
      },
      {
        label: '开柜补货',
        value: 'replenishment',
      },
      {
        label: '公告消息',
        value: 'noticeMessage',
      },
    ],
  ];

  drawWaterChart() {
    var chart = new F2.Chart({
      id: 'waterChart',
      pixelRatio: window.devicePixelRatio,
    });

    chart.source(this.water);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.4,
      radius: 0.75,
    });
    chart.axis(false);
    chart.legend({
      position: 'bottom',
      align: 'center',
    });

    // 配置文本饼图
    chart.pieLabel({
      sidePadding: 10,
      label1(data: any) {
        return {
          fill: '#000000',
          text: '$' + data.amount.toFixed(2),
          fontWeight: 500,
          fontSize: 10,
        };
      },
    });
    chart
      .interval()
      .position('const*amount')
      .size(64)
      .color('memo', ['#B5C1FD', '#4958f3'])
      .adjust('stack');
    chart.render();
    chart.get('canvas').draw();

    this.waterChart = chart;
  }
  drawOrderChart() {
    var chart = new F2.Chart({
      id: 'orderChart',
      pixelRatio: window.devicePixelRatio,
    });

    chart.source(this.order);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.4,
      radius: 0.75,
    });
    chart.axis(false);
    chart.legend({
      position: 'bottom',
      align: 'center',
    });

    // 配置文本饼图
    chart.pieLabel({
      sidePadding: 10,
      label1(data: any) {
        return {
          fill: '#000000',
          text: data.amount + '笔',
          fontWeight: 500,
          fontSize: 10,
        };
      },
    });
    chart
      .interval()
      .position('const*amount')
      .size(64)
      .color('memo', ['#B5C1FD', '#4958f3'])
      .adjust('stack');
    chart.render();
    chart.get('canvas').draw();

    this.orderChart = chart;
  }
  clickHandler(value: string) {
    this.$router.push(value);
  }
}

interface TesetModel {
  name: string;
  label: string;
}
</script>

<style lang="stylus" scoped>
.chart-area
  display flex
  height 130

  .nochart
    position absolute
    top 0
    left 0
    width 100%
    height 130px
    background-color #EFEFF4
    line-height 130px
    text-align center

.item-title
  display flex

.item-content
  display flex
  padding-top 24px

.fund
  height 50px
  background-color #B5C1FD
  border-radius 18px
  margin-top 10px
  color #fff

.title
  margin-top -14px
  text-align left
  font-size 13px
  padding-left 6%
  line-height 14px

.left-content
  font-size 34px
  line-height 46px
  float left
  width 70%
  padding-left 6%
  text-align left

.right-content
  width 14%
  text-align center
  margin 4%
  padding-left 1%
  font-size 14px
  float right
  height 24px
  line-height 24px
  border-radius 18px
  background-color #fff
  color #00f

.cube-tab
  div
    width 100%
    height 50px
    // background-size: 38% 90%;

.procurementMall
  background url('../assets/image/shopping-mall.svg') no-repeat center

.equipment
  background url('../assets/image/my-cabinets.svg') no-repeat center

.equipmentGoods
  background url('../assets/image/cabinet-goods.svg') no-repeat center

.order
  background url('../assets/image/order-search.svg') no-repeat center

.procurementMallRecord
  background url('../assets/image/procurement-records.svg') no-repeat center

.developEamrnings
  background url('../assets/image/development-income.svg') no-repeat center

.replenishment
  background url('../assets/image/replenishment.svg') no-repeat center

.noticeMessage
  background url('../assets/image/noticeMessage.svg') no-repeat center
.tabItem 
  font-size: 14px;
.cart
  font-size 46px
  // position absolute
  // display flex
  // right 0;
  // margin-top -20px
  // margin-right 20px
  color #8c58dd

  
</style>

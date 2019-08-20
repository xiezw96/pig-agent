<template>
  <cube-page title="结算订单">
    <template #rightExtAction>
      <i @click="goSerach" class="cubeic-search"></i>
    </template>
    <div slot="content">
      <div class="custom-item">
        <span class="avatar">可结算金额:</span>
        <span class="name">
          {{ originalSettlementPrice }}
        </span>
        <span class="status" @click="goSettle">
          申请结算&nbsp;<i class="cubeic-arrow"></i>
        </span>
      </div>

      <div class="view-wrapper">
        <div class="index-list-wrapper custom">
          <cube-index-list
            ref="indexList"
            :data="list"
            :navbar="false"
            :options="indexListOptions"
            @pulling-up="onPullingUp"
          >
            <cube-index-list-item
              v-for="(item, index) in list"
              :key="index"
              :item="item"
              @select="selectItem"
            >
              <div class="indexContent">
                <div class="data-item">
                  <span class="left">订单日期：{{ item.reqTime | date }}</span>
                  <span class="right"
                    >状态：{{ item.status | auditStatus }}</span
                  >
                </div>
                <div class="data-price">
                  <span class="left">结算金额</span>
                  <span class="right">{{ item.originalTotal }}</span>
                </div>
                <div class="data-price">
                  <span class="left">通道费用</span>
                  <span class="right">{{ item.commission }}</span>
                  <span class="operation"><i class="cubeic-arrow"></i></span>
                </div>
                <div class="data-price">
                  <span class="left">结算到账金额</span>
                  <span class="right">{{ item.total }}</span>
                </div>
              </div>
            </cube-index-list-item>
          </cube-index-list>
        </div>
      </div>
      <cube-popup type="form-popup" ref="formPopup" maskClosable>
        <cube-form :model="model" @submit.prevent="submitHandler">
          <cube-form-group>
            <cube-form-item :field="fields[0]"></cube-form-item>
            <cube-form-item :field="fields[1]"></cube-form-item>
            <cube-form-item :field="fields[2]"></cube-form-item>
            <cube-form-item :field="fields[3]"></cube-form-item>
          </cube-form-group>
          <cube-form-group style="padding-top: 10px;height: 45px;">
            <cube-button type="submit">提交</cube-button>
          </cube-form-group>
        </cube-form>
      </cube-popup>
      <cube-popup
        type="search-form-popup"
        position="bottom"
        maskClosable
        ref="searchFormPopup"
      >
        <cube-form :model="searchForm" @submit.prevent="searchSubmitHandler">
          <cube-form-group>
            <cube-form-item :field="searchFields[0]"></cube-form-item>
            <cube-form-item :field="searchFields[1]"></cube-form-item>
            <cube-form-item :field="searchFields[2]"></cube-form-item>
          </cube-form-group>
          <cube-form-group style="padding-top: 10px;height: 45px;">
            <cube-button type="submit">查询</cube-button>
          </cube-form-group>
        </cube-form>
      </cube-popup>
    </div>
  </cube-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import CubePage from '@/components/cube-page.vue';
import { find, omitBy, isNil } from 'lodash';
import { format, startOfDay, endOfDay } from 'date-fns';
import { mapActions, mapState } from 'vuex';

const initFormValues = {
  orderCode: '',
  createDate: [],
  reqStartTime: '',
  reqEndTime: '',
  ofAgent: '',
  current: 1,
  size: 20,
};

import { date } from '../../filters/date.filter';
import DateRangePickerComponent from '../../components/date-range-picker.vue';
import { Popup } from 'cube-ui';
import { settlementService } from '@/services';
import { toast } from '@/utils';
const Settlement = namespace('settlement');
const Withdrawal = namespace('withdrawal');

@Component({
  components: {
    CubePage,
  },
  async created() {
    this.getSettleAccount();
  },
})
export default class SettleComponent extends Vue {
  name: 'settle-account';
  searchFields = [
    {
      type: 'input',
      modelKey: 'orderCode',
      label: '订单号',
      props: {
        type: 'text',
        placeholder: '请输入订单号',
      },
      rules: {
        type: 'number',
        custom: (data: any) => {
          return data.length < 11;
        },
      },
    },
    {
      component: DateRangePickerComponent,
      modelKey: 'createDate',
      label: '申请日期',
    },
    {
      type: 'select',
      modelKey: 'ofAgent',
      label: '归属',
      props: {
        options: [
          { value: 0, text: '自有' },
          { value: 1, text: '商城' },
          { value: 2, text: '下级' },
        ],
        placeholder: '请选择归属',
      },
    },
  ];
  fields = [
    {
      type: 'input',
      modelKey: 'originalSettlementPrice',
      label: '可结算金额',
      props: {
        readonly: true,
      },
    },
    {
      type: 'input',
      modelKey: 'commission',
      label: '通道费用',
      props: {
        readonly: true,
      },
    },
    {
      type: 'input',
      modelKey: 'settlementPrice',
      label: '到账金额',
      props: {
        readonly: true,
      },
    },
    {
      type: 'input',
      modelKey: 'transactionPwd',
      label: '交易密码',
      props: {
        type: 'password',
        placeholder: '请输入交易密码',
      },
      rules: {
        required: true,
        mix: 6,
        max: 20,
      },
      trigger: 'blur',
    },
  ];
  valid = undefined;
  $refs: {
    searchFormPopup: Popup;
    formPopup: Popup;
  };
  indexListOptions = {
    pullUpLoad: true,
  };
  searchForm = {
    ...initFormValues,
  };
  model = {
    // developNum: this.settlementTotal,
    commission: 0,
    settlementPrice: 0,
    originalSettlementPrice: 0,
    transactionPwd: '',
  };

  @Settlement.State
  isMore: boolean;

  @Settlement.State
  list: any[];

  @Settlement.State
  originalSettlementPrice: number;

  @Settlement.State
  settlementPrice: number;

  @Settlement.State
  commission: number;

  @Settlement.Action
  searchPage: (payload) => Promise<void>;

  goSettle(item: any) {
    this.model.originalSettlementPrice = this.originalSettlementPrice;
    this.model.settlementPrice = this.settlementPrice;
    this.model.commission = this.commission;
    this.$refs.formPopup.show();
  }
  goSerach() {
    this.$refs.searchFormPopup.show();
  }
  async getSettleAccount() {
    if (this.searchForm.createDate.length > 0) {
      this.searchForm.reqStartTime = format(
        startOfDay(this.searchForm.createDate[0]),
        'YYYY-MM-DD HH:mm:ss',
      );
      this.searchForm.reqEndTime = format(
        endOfDay(this.searchForm.createDate[1]),
        'YYYY-MM-DD HH:mm:ss',
      );
      this.searchForm.createDate = [];
    }
    let dto = omitBy(this.searchForm, isNil);
    dto = omitBy(this.searchForm, value => value === '');

    await this.searchPage(dto);
  }
  async submitHandler(e: any) {
    this.$refs.formPopup.hide();
    await settlementService.applySettlement(this.model);
    toast({ txt: '申请成功', time: 2000 });
    this.getSettleAccount();
  }
  onPullingUp() {
    if (!this.isMore) {
      (this as any)
        .$createToast({
          time: 1000,
          txt: '无更多数据',
        })
        .show();
      (this as any).$refs.indexList.forceUpdate();
      return;
    }
    const toast = (this as any).$createToast({
      time: 12000,
      txt: '加载更多数据....',
    });
    toast.show();
    this.searchForm.current++;
    this.getSettleAccount();
    (this as any).$refs.indexList.forceUpdate();
    toast.hide();
  }
  searchSubmitHandler(e: any) {
    this.getSettleAccount();
    this.$refs.searchFormPopup.hide();
  }
  selectItem(item: any) {
    this.$router.push({ name: 'settleAccountDetail', params: item });
  }
}
</script>

<style lang="stylus" scoped>
.indexList
  // background-color: #fff;
  padding-top 5px

.grand-item
  height 30px
  align-items center
  padding 12px 0 0 0px
  border-bottom 1px solid #efeff4

  .status
    float right
    padding-right 2%
    font-size 14px

.custom-item
  display flex
  height 50px
  align-items center
  padding 0 0 0 10px
  background-color #fff
  border-bottom 1px solid #efeff4

  .avatar
    width 32%
    text-align left

  .name
    width 36%
    text-align left

  .status
    font-size 14px
    padding-right 2%
    width 30%
    text-align right

.data-item
  display flex
  height 30px
  align-items center
  padding 12px 0 0 10px

.left
  text-align left
  width 50%

.right
  width 40%
  text-align right

.operation
  width 10%
  text-align right
  margin-top -30px
  padding-right 2%

.data-price
  display flex
  height 30px
  align-items center
  font-size 14px
  padding 0 0 0 10px
  background-color #fff

.indexContent
  font-size 14px
  border-bottom 1px solid #efeff4

.view-wrapper
  position fixed
  top 112px
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

.cube-index-list-item_active
  background #fff
</style>

<template>
  <cube-page title="提现">
    <template #rightExtAction>
      <i @click="onOpenSearchFormPopup()" class="cubeic-search"></i>
    </template>
    <template #content>
      <div class="custom-item" @click="onOpenWithdrawFormPopup()">
        <span class="left">我的资金：{{ total }}</span>
        <span class="right"> 申请提现&nbsp;<i class="cubeic-arrow"></i> </span>
      </div>
      <cube-scroll>
        <div class="card" v-for="item in list" :key="item.id">
          <div class="row">
            <span class="left">操作日期：{{ item.reqTime }}</span>
            <span class="right">
              状态：
              <template v-if="item.auditStatus === 1">
                {{ item.remitStatus | remit_status }}
              </template>
              <template v-else>
                {{ item.auditStatus | withdraw_audited_status }}
              </template>
            </span>
          </div>
          <div class="row">提现金额：{{ item.total }}</div>
        </div>
      </cube-scroll>
      <cube-popup type="form-popup" ref="withdrawFormPopup">
        <cube-form
          ref="withdrawForm"
          :model="withdrawFormValues"
          @submit.prevent="onWithdraw()"
        >
          <cube-form-group>
            <cube-form-item
              :field="withdrawFormGroup.withdrawalPrice"
            ></cube-form-item>
            <cube-form-item
              :field="withdrawFormGroup.reqMoney"
            ></cube-form-item>
            <cube-form-item
              :field="withdrawFormGroup.transactionPwd"
            ></cube-form-item>
          </cube-form-group>
          <cube-form-group style="padding-top: 10px;height: 45px;">
            <cube-button inline type="submit">提交</cube-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <cube-button inline @click="onCancel()">
              取消
            </cube-button>
          </cube-form-group>
        </cube-form>
      </cube-popup>
      <cube-popup
        type="search-form-popup"
        position="bottom"
        maskClosable
        ref="searchFormPopup"
      >
        <cube-form
          ref="searchForm"
          :model="searchFormValues"
          @submit.prevent="onSearch()"
        >
          <cube-form-group>
            <cube-form-item :field="searchFormGroup.dateRange"></cube-form-item>
            <cube-form-item
              :field="searchFormGroup.auditStatus"
            ></cube-form-item>
          </cube-form-group>
          <cube-form-group style="padding-top: 10px;height: 45px;">
            <cube-button type="submit" @click="onSearch()">查询</cube-button>
          </cube-form-group>
        </cube-form>
      </cube-popup>
    </template>
  </cube-page>
</template>
<script lang="ts">
import { Form, Popup } from 'cube-ui';
import { cloneDeep, omit } from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';
import DateRangePickerComponent from '@/components/date-range-picker.vue';
import { AuditedStatus } from '@/enums';
import { toFormGroup, toast } from '@/utils';
import { isDate, format, startOfDay, endOfDay } from 'date-fns';
import { withdrawalService } from '../../services';

const Withdrawal = namespace('withdrawal');

const initSearchFormValues = {
  dateRange: [],
  auditStatus: -1,
};

const initWithdrawFormValues = {
  withdrawalPrice: undefined,
  reqMoney: undefined,
  transactionPwd: '',
};

@Component<WithdrawDepositComponent>({
  components: {
    CubePage,
  },
  created() {
    this.search();
    this.getTotal();
  },
})
export default class WithdrawDepositComponent extends Vue {
  searchFormValues = cloneDeep(initSearchFormValues);

  withdrawFormValues = cloneDeep(initWithdrawFormValues);

  withdrawFormGroup = toFormGroup([
    {
      type: 'input',
      modelKey: 'withdrawalPrice',
      label: '可提现金额',
      props: {
        readonly: true,
      },
    },
    {
      type: 'input',
      modelKey: 'reqMoney',
      label: '提现金额',
      rules: {
        type: 'number',
        required: true,
        min: 100,
      },
      messages: {
        pattern: '请输入正确金额,最多保留两位小数.',
        custom: '可提现金额不足',
      },
      trigger: 'blur',
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
        min: 6,
        max: 20,
      },
      trigger: 'blur',
    },
  ]);

  searchFormGroup = toFormGroup([
    {
      component: DateRangePickerComponent,
      modelKey: 'dateRange',
      label: '申请日期',
      props: {
        clearable: true,
        placeholder: '全部',
      },
    },
    {
      type: 'select',
      modelKey: 'auditStatus',
      label: '状态归属',
      props: {
        options: [
          { value: -1, text: '全部' },
          { value: AuditedStatus.待审核, text: AuditedStatus[0] },
          { value: AuditedStatus.通过, text: AuditedStatus[1] },
          { value: AuditedStatus.不通过, text: AuditedStatus[2] },
        ],
        placeholder: '请选择审核状态',
      },
    },
  ]);

  $refs: {
    searchFormPopup: Popup;
    searchForm: Form;
    withdrawFormPopup: Popup;
    withdrawForm: Form;
  };

  @Withdrawal.State
  list: any[];

  @Withdrawal.State('withdrawalTotal')
  total: number;

  @Withdrawal.Action
  search: (payload) => Promise<void>;

  @Withdrawal.Action
  getTotal: () => Promise<void>;

  onOpenWithdrawFormPopup() {
    this.withdrawFormValues = {
      withdrawalPrice: this.total,
      reqMoney: undefined,
      transactionPwd: '',
    } as any;
    this.$refs.withdrawFormPopup.show();
  }

  onOpenSearchFormPopup() {
    this.$refs.searchFormPopup.show();
  }

  async onSearch() {
    const { dateRange, auditStatus } = this.searchFormValues;
    let dto = {} as any;
    const [start, end] = dateRange;
    if ([start, end].every(isDate)) {
      dto.reqStartTime = format(startOfDay(start), 'YYYY-MM-DD HH:mm:ss');
      dto.reqEndTime = format(endOfDay(end), 'YYYY-MM-DD HH:mm:ss');
    }

    if (auditStatus !== -1) {
      dto.auditStatus = auditStatus;
    }

    await this.search(dto);
    this.$refs.searchFormPopup.hide();
  }

  async onWithdraw() {
    const valid = await (this.$refs.withdrawForm as any).validate();
    if (!valid) return;
    const dto = omit(this.withdrawFormValues, 'withdrawalPrice');

    await withdrawalService.applyWithdrawalRequest(dto);
    this.$refs.withdrawFormPopup.hide();
    toast({ txt: '申请成功', time: 2000 });
    this.getTotal();
    this.onSearch();
  }

  onCancel() {
    this.$refs.withdrawFormPopup.hide();
  }

  getStatus(code: number) {
    if (!Number.isInteger(code)) return '';
    return AuditedStatus[code];
  }
}
</script>

<style lang="stylus" scoped>
.indexList
  background-color #fff
  padding-top 5px

.custom-item
  display flex
  height 60px
  justify-content space-between
  align-items center
  padding 0 16px
  background-color #fff

  .left
    color $color-text-l
    font-size $font-size-medium

  .right
    flex 0 0 auto
    font-size 14px

.card
  font-size 14px
  background-color #fff

  &:first-child
    margin-top 8px

  & + &
    border-top 1px solid transparentify(#000, 0.1)

.row
  display flex
  justify-content space-between
  padding 0 10px
  line-height 2

.view-wrapper
  position fixed
  top 122px
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

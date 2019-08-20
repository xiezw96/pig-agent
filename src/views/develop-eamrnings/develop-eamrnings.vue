<template>
  <cube-page title="发展收益">
    <template #rightExtAction>
      <i @click="onShowSearchFormPopup()" class="cubeic-search"></i>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; height: 100%;">
        <div style="flex: none; border-radius: 12px; overflow: hidden;">
          <div class="custom-item">
            <span class="avatar">累计发展奖励：</span>
            <span class="name">
              {{ reward.sumMonty }}
            </span>
            <span class="status" @click="onNavigateToRecommend()">
              我要推荐 <i class="cubeic-arrow"></i>
            </span>
          </div>
          <div class="custom-item" @click="onShowApplyFormPopup()">
            <span class="avatar">待结算奖励:</span>
            <span class="name">
              {{ applyFormValues.settlementMonty }}
            </span>
            <span class="status"> 结算申请 <i class="cubeic-arrow"></i> </span>
          </div>
        </div>
        <app-spacer></app-spacer>
        <cube-scroll style="flex: auto;">
          <div
            v-for="item in applications"
            :key="item.id"
            class="indexContent"
            @click="onNavigateToDetail(item)"
          >
            <div class="data-item">
              <span class="left">日期：{{ item.reqTime | date }}</span>
              <span class="right"
                >状态：{{ item.auditStatus | reward_audited_status }}</span
              >
            </div>
            <div class="data-price">
              <span class="left">发展个数</span>
              <span class="right">{{ item.developNum }}</span>
              <span class="operation"><i class="cubeic-arrow"></i></span>
            </div>
            <div class="data-price">
              <span class="left">奖励金额</span>
              <span class="right">{{ item.originalTotalMoney }}</span>
            </div>
            <div class="data-price">
              <span class="left">通道费用</span>
              <span class="right">{{ item.commission }}</span>
            </div>
            <div class="data-price">
              <span class="left">奖励到账金额</span>
              <span class="right">{{ item.totalMoney }}</span>
            </div>
          </div>
        </cube-scroll>
      </div>
      <cube-popup ref="applyFormPopup" type="form-popup" maskClosable>
        <cube-form
          ref="applyForm"
          :schema="applyFormGroup"
          :model="applyFormValues"
          @submit.prevent="onApply()"
        ></cube-form>
      </cube-popup>
      <cube-popup
        ref="searchFormPopup"
        type="search-form-popup"
        position="bottom"
        maskClosable
      >
        <cube-form
          ref="searchForm"
          :schema="searchFormGroup"
          :model="searchFormValues"
        ></cube-form>
      </cube-popup>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CubePage from '@/components/cube-page.vue';
import { find } from 'lodash';
import { toast } from '../../utils';
import {
  getReward,
  applyReward,
  fetchApplicationList,
} from '../../services/develop-eamrnings.service';
import { applyFormConfig } from './apply-form.config';
import DateRangePickerComponent from '../../components/date-range-picker.vue';
import { Form, Popup, Loading, Toast, Dialog } from 'cube-ui';
import { isDate, format, startOfDay, endOfDay } from 'date-fns';

@Component<DevelopEarningsComponent>({
  components: {
    CubePage,
  },
  beforeCreate() {
    this.loading = this.$createToast({
      mask: true,
      time: 0,
    });
  },
  async created() {
    this.getData();
  },
})
export default class DevelopEarningsComponent extends Vue {
  applications: any[] = [];

  searchFormValues = {
    // phone: '',
    dateRange: [],
    auditStatus: -1,
  };

  applyFormValues = {
    settlementCount: 0,
    settlementMonty: 0,
    originalSettlementMonty: 0,
    commission: 0,
    transactionPwd: '',
  };

  searchFormGroup = {
    fields: [
      {
        component: DateRangePickerComponent,
        modelKey: 'dateRange',
        label: '申请日期',
        props: {
          placeholder: '请选择申请日期',
        },
      },
      {
        type: 'select',
        modelKey: 'auditStatus',
        label: '状态',
        props: {
          options: [
            { value: -1, text: '全部' },
            { value: 0, text: '待审核' },
            { value: 1, text: '通过' },
            { value: 2, text: '不通过' },
          ],
          placeholder: '请选择审核状态',
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

  applyFormGroup = {
    fields: [
      {
        type: 'input',
        modelKey: 'settlementCount',
        label: '个数',
        props: {
          type: 'number',
          readonly: true,
        },
      },
      {
        type: 'input',
        modelKey: 'originalSettlementMonty',
        label: '奖励金额',
        props: {
          type: 'number',
          readonly: true,
        },
      },
      {
        type: 'input',
        modelKey: 'commission',
        label: '通道费用',
        props: {
          type: 'number',
          readonly: true,
        },
      },
      {
        type: 'input',
        modelKey: 'settlementMonty',
        label: '奖励到账金额',
        props: {
          type: 'number',
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
          autocomplete: false,
        },
        rules: {
          required: true,
          min: 6,
          max: 20,
        },
      },
      {
        label: '提交',
        type: 'submit',
      },
    ],
  };

  reward = {};

  loading: Toast;

  $refs: {
    applyForm: Form;
    applyFormPopup: Popup;
    searchForm: Form;
    searchFormPopup: Popup;
  };

  onShowApplyFormPopup() {
    this.$refs.applyFormPopup.show();
  }

  onShowSearchFormPopup() {
    this.$refs.searchFormPopup.show();
  }

  onCancel() {
    this.$refs.applyFormPopup.hide();
  }

  async onApply() {
    const valid = await (this.$refs.applyForm as any).validate();
    if (!valid) return;

    const loading = this.$createToast({
      mask: true,
      time: 0,
    });
    loading.show();
    try {
      await applyReward(this.applyFormValues);
      this.$refs.applyFormPopup.hide();
    } finally {
      loading.hide();
    }

    await this.alert();
    this.getData();
  }

  async onSearch() {
    const { dateRange, auditStatus } = this.searchFormValues;
    const dto = {} as any;
    if (dateRange.length === 2 && dateRange.every(isDate)) {
      const [start, end] = dateRange;
      dto.reqStartTime = format(startOfDay(start), 'YYYY-MM-DD HH:mm:ss');
      dto.reqEndTime = format(endOfDay(end), 'YYYY-MM-DD HH:mm:ss');
    }
    if (auditStatus && auditStatus !== -1) {
      dto.auditStatus = auditStatus;
    }

    this.$refs.searchFormPopup.hide();

    this.loading.show();
    try {
      this.applications = await fetchApplicationList(dto);
    } finally {
      this.loading.hide();
    }
  }

  onNavigateToRecommend() {
    this.$router.push({ name: 'developEamrningsRecommend' });
  }

  onNavigateToDetail(item: any) {
    this.$router.push({
      name: 'developEamrningsDetail',
      params: { id: item.id, reqTime: item.reqTime },
    });
  }

  async getData() {
    this.loading.show();
    try {
      const [reward, applications] = await Promise.all([
        getReward(),
        fetchApplicationList(),
      ]);
      this.reward = reward;
      const { sumMonty, ...rest } = reward;
      this.applyFormValues = { ...this.applyFormValues, ...rest };
      this.applications = applications;
    } finally {
      this.loading.hide();
    }
  }

  alert() {
    return new Promise(resolve => {
      this.$createDialog({
        type: 'alert',
        title: '结算申请',
        content: '结算申请已提交',
        onConfirm: () => {
          resolve();
        },
      }).show();
    });
  }
}
</script>

<style lang="stylus" scoped>
@require '~@/theme.styl'

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
  padding 8px 10px
  background-color $secondary-color

.left
  text-align left
  width 50%

.right
  width 40%
  text-align right
  // padding-right: 4%;

.operation
  width 10%
  text-align right
  padding-right 2%

.data-price
  display flex
  height 30px
  align-items center
  font-size 14px
  padding 0 0 0 10px
  background-color #fff

.indexContent
  background-color #fff
  overflow hidden

  &:first-child
    border-top-left-radius $border-radius
    border-top-right-radius $border-radius

  &:last-child
    border-bottom-left-radius $border-radius
    border-bottom-right-radius $border-radius

  + .indexContent
    border-top 1px solid #efeff4
</style>

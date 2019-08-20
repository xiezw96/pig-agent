<template>
  <cube-page title="发展收益">
    <template #content>
      <div class="mdc-elevation--z2">
        <div class="grand-item">
          申请日期：{{ reqTime | date }}
        </div>
        <div class="grand-item">
          状态：{{ application.auditStatus | reward_audited_status }}
        </div>
        <div class="grand-item">奖励总金额：{{ application.totalMoney }}</div>
      </div>
      <app-spacer></app-spacer>
      <div class="mdc-elevation--z2">
        <div class="data-item" v-for="item in list" :key="item.id">
          <span class="left">姓名：{{ item.agentName }}</span>
          <span class="right">激活日期：{{ item.activeTime | date }}</span>
        </div>
      </div>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { find } from 'lodash';
import { getApplicationDetail } from '@/services/develop-eamrnings.service';

@Component<DetailComponent>({
  async created() {
    const { developAuditDetails, ...application } = await getApplicationDetail(
      this.id,
    );
    this.application = application;
    this.list = developAuditDetails;
    this.reqTime = this.$route.params.reqTime;
  },
})
export default class DetailComponent extends Vue {
  @Prop()
  id: string;

  reqTime: any = '';

  application: any = {};

  list: any[] = [];
}
</script>

<style lang="stylus" scoped>
.grand-item
  padding 8px
  text-align left
  line-height 1.7
  background-color #fff

  + .grand-item
    border-bottom 1px solid #efeff4

.data-item
  display flex
  align-items center
  padding 8px
  line-height 1.7
  background-color #fff

  + .data-item
    border-top 1px solid #efeff4

  // background-color: #e0dede
  .left
    text-align left
    width 50%

  .right
    width 50%
</style>

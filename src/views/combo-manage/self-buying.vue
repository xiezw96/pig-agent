<template>
  <div style="text-align: left; line-height: 2;">
    <p>购买柜子数量：</p>
    <div style="margin-left: 6%;" v-for="(item, index) in combo.machineList" :key="index">
      <span>型号名称:{{ item.machineSpecName }}</span>
      <span style="float: right;margin-right: 6px;">数量:{{ item.num }}</span>
    </div>
    <p>设备总费用：{{ total }}</p>
    <p v-if="combo.voucherName">赠送代金券：{{ combo.voucherName }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SelfBuying extends Vue {
  @Prop()
  combo: any;

  @Prop()
  total: any;
}
</script>

<template>
  <cube-page title="发展抽佣">
    <template #content>
      <div class="form">
        <cube-form
          :model="model"
          :schema="schema"
          :immediate-validate="false"
          @validate="validateHandler"
          @submit="submitHandler"
        >
        </cube-form>
      </div>
    </template>
  </cube-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
import CubePage from '@/components/cube-page.vue';

import { agentService, commissionratioService } from '@/services';
import { toast } from '../../utils';

@Component<DevelopCommissionComp>({
  name: 'develop-commission',
  components: {
    'cube-page': CubePage,
  },
  created() {
    this.getAgent();
  },
})
export default class DevelopCommissionComp extends Vue {
  validity: any = {};
  valid: any = undefined;
  model: any = {
    ratio: '0',
  };
  schema: any = {
    fields: [
      {
        type: 'input',
        modelKey: 'ratio',
        label: '抽佣比例',
        props: {
          type: 'text',
          placeholder: '请输入抽佣比例单位(%)',
        },
        rules: {
          type: 'number',
          min: 1,
          max: 100,
          required: true,
        },
        messages: {
          pattern: '请输入1-100之间数字,最多保留两位小数.',
        },
        trigger: 'blur',
      },
      {
        type: 'submit',
        label: '提交',
      },
    ],
  };
  async getAgent() {
    const result: any = await agentService.get();
    if (result.childProfit) {
      this.model.ratio = (Number(result.childProfit) * 100)
    }
  }
  submitHandler(e: any) {
    e.preventDefault();
    if (!this.valid) return;
    commissionratioService.update(this.model);
    toast({ txt: '设置成功', time: 2000 });
  }
  validateHandler(result: any) {
    this.validity = result.validity;
    this.valid = result.valid;
  }
}
</script>

<style lang="stylus" scoped>
.title
  padding-top 15%
</style>

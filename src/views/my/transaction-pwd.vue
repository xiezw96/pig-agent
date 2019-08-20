<template>
  <cube-page title="交易密码">
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
import Vue from 'vue';

import CubePage from '@/components/cube-page.vue';
import SendCode from '@/components/send-code.vue';

import { agentService, smsService } from '@/services';
import { toast } from '@/utils';
import { ValidateCode } from '@/mixins';

import { mapState } from 'vuex';

export default Vue.extend({
  name: 'transaction-pwd',
  mixins: [ValidateCode],
  components: {
    CubePage,
    SendCode,
  },
  data(this: any) {
    return {
      validity: {},
      valid: undefined,
      model: {
        id: '',
        phone: '',
        transactionPwd: '',
        code: '',
        type: 'agent_pay_resetpwd',
      },
      schema: {
        fields: [
          {
            type: 'input',
            modelKey: 'phone',
            label: '手机号',
            props: {
              type: 'number',
              placeholder: '请输入11位手机号',
              disabled: true,
            },
            rules: {
              type: 'tel',
            },
            trigger: 'blur',
          },
          {
            component: SendCode,
            modelKey: 'code',
            events: {
              send: this.send,
            },
            label: '验证码',
            rules: {
              type: 'number',
              required: true,
              len: 6,
            },
            props: {
              title: '发送短信',
            },
          },
          {
            type: 'input',
            modelKey: 'transactionPwd',
            label: '新密码',
            props: {
              type: 'password',
              placeholder: '请输入交易密码',
            },
            rules: {
              len: 6,
              required: true,
            },
            trigger: 'blur',
          },
          {
            type: 'submit',
            label: '提交',
          },
        ],
      },
    };
  },
  mounted() {
    if (this.profile.phone) {
      this.model.phone = this.profile.phone;
    }
  },
  methods: {
    async submitHandler(e: any) {
      e.preventDefault();
      if (!this.valid) return;
      await this.validCode();
      const result = await agentService.transactionpwd(this.model);
      if (!result.data) {
        toast({ txt: '修改失败', type: 'error', time: 2000 });
        return;
      } else {
        toast({ txt: '修改成功', type: 'correct', time: 2000 });
      }
    },
    validateHandler(result: any) {
      this.validity = result.validity;
      this.valid = result.valid;
    },
    async send() {
      this.sendCode();
    },
  },
  computed: {
    ...mapState({
      profile: state => (state as any).workspace.user.agentInfo,
    }),
  },
});
</script>

<style lang="stylus" scoped>
.title
  padding-top 15%
</style>

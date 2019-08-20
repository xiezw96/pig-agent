<template>
  <cube-page title="忘记密码">
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

import { toast } from '@/utils';
import { agentService, smsService } from '@/services';
import { ValidateCode } from '@/mixins';

export default Vue.extend({
  name: 'register',
  components: {
    CubePage,
    SendCode,
  },
  mixins: [ValidateCode],
  data(this: any) {
    return {
      validity: {},
      valid: undefined,
      model: {
        phone: '',
        pwd: '',
        code: '',
        smsToken: '',
        type: 'agent_resetpwd',
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
            },
            rules: {
              type: 'tel',
              required: true,
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
            },
            props: {
              title: '发送短信',
            },
          },
          {
            type: 'input',
            modelKey: 'pwd',
            label: '密码',
            props: {
              type: 'password',
              placeholder: '请输入8-20密码',
              required: true,
            },
            rules: {
              min: 6,
              max: 20,
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
  methods: {
    async submitHandler(e: any) {
      e.preventDefault();
      if (!this.valid) return;

      const isExists = await agentService.isexists(this.model.phone);
      if (!isExists.data) {
        toast({ txt: '用户不存在,请注册', type: 'error', time: 2000 });
        return;
      }
      await this.validCode();
      const result = await agentService.resetPwd(this.model);
      if (!result.data) {
        toast({ txt: '修改失败', type: 'error', time: 2000 });
        return;
      } else {
        toast({ txt: '修改成功,请重新登录', type: 'correct', time: 2000 });
        this.$router.push({ name: '登陆' });
      }
    },
    validateHandler(result: any) {
      this.validity = result.validity;
      this.valid = result.valid;
    },
    async send() {
      if (!this.model.phone) {
        toast({ txt: '请填写手机号', type: 'error' });
        return;
      }
      const isExists = await agentService.isexists(this.model.phone);
      if (!isExists.data) {
        toast({ txt: '用户不存在,请注册', type: 'error', time: 2000 });
        return;
      }
      this.sendCode();
    },
  },
});
</script>

<style lang="stylus" scoped>
.title
  padding-top 15%
</style>

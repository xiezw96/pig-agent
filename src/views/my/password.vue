<template>
  <cube-page title="我的密码">
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
import Component, { mixins } from 'vue-class-component';
import { State, namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';
import SendCode from '@/components/send-code.vue';

import { toast } from '@/utils';
import { agentService, smsService, userService, currentUserService } from '@/services';
import { ValidateCode } from '@/mixins';
import { UserEntity } from '@/entities';

const User = namespace('workspace/user');

@Component<PasswordComp>({
  name: 'password',
  components: {
    'cube-page': CubePage,
    'send-code': SendCode,
  },
  mounted() {
    if (this.profile.phone) {
      this.model.phone = this.profile.phone;
    }
  },
})
export default class PasswordComp extends mixins(ValidateCode) {
  validity: any = {};
  valid: any = undefined;
  model: any = {
    phone: '',
    pwd: '',
    code: '',
    smsToken: '',
    type: 'agent_resetpwd',
  }
  schema: any = {
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
        },
        rules: {
          min: 6,
          max: 20,
          required: true,
        },
        trigger: 'blur',
      },
      {
        type: 'submit',
        label: '提交',
      },
    ],
  }

  @User.State('agentInfo')
  profile: any;

  @User.Mutation
  clear: () => void;

  async submitHandler(e: any) {
    e.preventDefault();
    if (!this.valid) return;
    await this.validCode();
    const result = await agentService.resetPwd(this.model);
    if (!result.data) {
      toast({ txt: '修改失败', type: 'error', time: 2000 });
      return;
    } else {
      toast({ txt: '修改成功,请重新登录', type: 'correct', time: 2000 });
      await currentUserService.logout();
      this.clear();
      this.$router.push({ name: '登陆' });
    }
  }
  validateHandler(result: any) {
    this.validity = result.validity;
    this.valid = result.valid;
  }
  async send() {
    this.sendCode();
  }
}
</script>

<style lang="stylus" scoped>
.title
  padding-top 15%
</style>

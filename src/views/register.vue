<template>
  <div class="login" :style="{ height: bgHeight + 'px' }">
    <div style="padding-top: 4%;display: flex;" @click="back">
      <i slot="prepend" class="cubeic-back back-icon"></i>
    </div>
    <div class="logo">
      <img src="../assets/image/logo01.png"/>
    </div>
      <div class="form">
        <!-- <cube-form
          ref="registerForm"
          :immediate-validate="true"
          :model="model"
          :schema="schema"
          @validate="validateHandler"
          @submit="submitHandler"
        >
        </cube-form> -->
        <cube-form
        ref="registerForm"
        style="padding-left: 10%;"
        :model="model"
        :immediate-validate="false"
        @validate="validateHandler"
        @submit="submitHandler"
      >
      <cube-form-group>
        <cube-form-item :field="fields[0]">
          <cube-input
            v-model="model.phone"
            placeholder="请输入手机号"
            class="login-input"
          >
          <i slot="prepend" class="cubeic-mobile-phone icon"></i>
          </cube-input>
        </cube-form-item>
        <cube-form-item :field="fields[1]">
          <cube-input v-model="model.code" placeholder="请输入验证码" class="login-input">
            <i slot="prepend" class="cubeic-scan icon"></i>
            <div class="code-button" slot="append">
              <cube-button :inline="true" @click="dosend" :disabled="sendValidButtonDisable">
                {{buttonTitle}}
              </cube-button>
            </div>
          </cube-input>
        </cube-form-item>
        <cube-form-item :field="fields[2]">
          <cube-input
            v-model="model.pwd"
            type="password"
            placeholder="请输入密码"
            class="login-input"
          >
          <i slot="prepend" class="cubeic-lock icon"></i>
          </cube-input>
        </cube-form-item>
        <cube-form-item :field="fields[3]" class="submit-button"></cube-form-item>
      </cube-form-group>
      </cube-form>
     </div>
  </div>
    </template>
  </cube-page>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component';

import CubePage from '@/components/cube-page.vue';
import SendCode from '@/components/send-code.vue';
import { namespace } from 'vuex-class';

import { toast } from '@/utils';

import {
  agentService,
  smsService,
  developmentRewordAuditingService,
} from '@/services';

import { ValidateCode } from '@/mixins';

@Component<RegisterComp>({
  name: 'register',
  components: {
    'cube-page': CubePage,
    'send-code': SendCode,
  },
  mixins: [ValidateCode],
})
export default class RegisterComp extends mixins(ValidateCode) {
  validity: any = {};
  valid: any = undefined;
  countDown = 60;
  sendValidButtonDisable: boolean = false;
  buttonTitle: string = '获取验证码';
  model: any = {
    phone: '',
    pwd: '',
    code: '',
    referrerCode: '',
    type: 'agent_regist',
  };
  bgHeight = document.documentElement.clientHeight;
  // schema: any = {
    fields:any[] = [
      {
        modelKey: 'phone',
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
        modelKey: 'code',
        events: {
          send: this.send,
        },
        rules: {
          type: 'number',
          required: true,
        },
        props: {
          title: '发送短信',
        },
      },
      {
        modelKey: 'pwd',
        props: {
          type: 'password',
          placeholder: '请输入6-10密码',
        },
        rules: {
          min: 6,
          max: 10,
          required: true,
        },
        trigger: 'blur',
      },
      // {
      //   type: 'input',
      //   modelKey: 'referrerCode',
      //   label: '邀请码',
      //   props: {
      //     placeholder: '请输入邀请码，若没有可不填',
      //   },
      //   rules: {
      //     max: 50,
      //   },
      //   trigger: 'blur',
      // },
      {
        type: 'submit',
        label: '提交',
      },
    ];
  // };

  back() {
    this.$router.back();
  }
  async submitHandler(e: any) {
    e.preventDefault();
    if (!this.valid) return;
    const isExists = await agentService.isexists(this.model.phone);
    if (isExists.data) {
      toast({ txt: '用户已存在', type: 'error', time: 2000 });
      return;
    }
    // 验证短信验证码
    await this.validCode();
    const result: any = await agentService.regist(this.model);
    if (!result.data.data) {
      toast({ txt: '注册失败', type: 'error', time: 2000 });
      return;
    } else {
      toast({ txt: '注册成功', type: 'correct', time: 2000 });
      setTimeout(()=> {
        this.$router.push({ name: '登陆' });
      }, 2000)
    }
  }
  codeChange(value) {
    this.model.code = value;
  }
  validateHandler(result: any) {
    this.validity = result.validity;
    this.valid = result.valid;
  }
  async send() {
    if (!this.model.phone) {
      toast({ txt: '请填写手机号', type: 'error', time: 2000 });
      return;
    }
    const isExists = await agentService.isexists(this.model.phone);
    if (isExists.data > 0) {
      toast({ txt: '用户已存在', type: 'error', time: 2000 });
      return;
    }
    this.sendCode();
  }
  async dosend() {
    const timer = setInterval(() => {
      if (this.countDown === 0) {
        this.countDown = 60;
        this.buttonTitle = '获取验证码';
        this.sendValidButtonDisable = false;
        clearInterval(timer);
        return;
      }
      const count = this.countDown--;
      this.sendValidButtonDisable = true;
      this.buttonTitle = count + 's';
    }, 1000);
    this.send()
  }
}
</script>

<style lang="stylus" scoped>
.login
  background url('../assets/image/bk-ground.png') no-repeat center
  width 100%
  height 100%
  position relative
  background-size cover

.logo
  margin-top: 20%;
  img
    width: 46%;

.form
  padding-top 5%
  width 90%

.pwd
  color #fff
  font-size 12px
  padding-left 8%

.register
  color #282db3
  padding-top 5%
  font-size 12px
  padding-left 86%

.cube-form
  background-color #fff0

.form >>> .cube-input
  background-color #fff0 !important
  color #fff

.code-button >>> .cube-btn
  background-color #fff0
  border 0px

.code-button >>> .cube-btn_disabled::after
  border: 0PX solid

.submit-button >>> .cube-btn
  width 60%;
  background-color #fff;
  color #4958f2;
  border-radius 0.5rem;
  height 48px
  font-size 18px
  padding 3.4% 0
  margin-left 20%
.icon
  font-size: 30px;
.back-icon
  font-size 24x
  color #fff
  padding-left 10px
.login-input >>> .cube-input-field
  padding: 13px 10px;
</style>

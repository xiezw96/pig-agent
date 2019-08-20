<template>
  <div class="login" :style="{ height: bgHeight + 'px' }">
    <div style="padding-top: 4%;">
      <label class="register" @click="toRegister">注册</label>
    </div>
    <div class="logo">
      <img src="../assets/image/login-logo.png"/>
    </div>
    <div class="form">
      <cube-form
        style="padding-left: 10%;"
        :model="model"
        :immediate-validate="false"
        @validate="validateHandler"
        @submit="submitHandler"
      >
      <cube-form-group>
        <cube-form-item :field="fields[0]">
          <cube-input
            v-model="model.username"
            placeholder="请输入手机号"
            class="login-input"
          >
          <i slot="prepend" class="cubeic-mobile-phone icon"></i>
          </cube-input>
        </cube-form-item>
        <cube-form-item :field="fields[1]">
          <cube-input
            v-model="model.password"
            type="password"
            placeholder="请输入密码"
            class="login-input"
          >
          <i slot="prepend" class="cubeic-lock icon"></i>
          </cube-input>
        </cube-form-item>
        <cube-form-item :field="fields[2]"></cube-form-item>
      </cube-form-group>
      </cube-form>
      <label class="pwd" @click="toResetPwd">忘记密码？</label>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { namespace } from 'vuex-class';

import { agentService } from '@/services';
const { mapActions, mapState } = createNamespacedHelpers('workspace/user');
const User = namespace('workspace/user');

import { loading, toast } from '@/utils';
import { couponStore } from '../store/personal/coupon.store';
import { UserEntity } from '../entities';

@Component
export default class LoginComponent extends Vue {
  validity = {};

  valid = null;

  model = {
    username: '',
    password: '',
  };
  created() {
    if (localStorage.getItem('fx_userName')) {
      this.model.username = localStorage.getItem('fx_userName');
    }
  }
  bgHeight = document.documentElement.clientHeight;

  // schema = {
    fields: any[] = [
      {
        type: 'input',
        modelKey: 'username',
        // label: '手机号',
        props: {
          type: 'tel',
          placeholder: '请输入11位手机号',
        },
        rules: {
          type: 'tel',
        },
        trigger: 'blur',
      },
      {
        type: 'input',
        modelKey: 'password',
        // label: '密码',
        props: {
          type: 'password',
          placeholder: '请输入6-20密码',
        },
        rules: {
          min: 6,
          max: 20,
        },
        trigger: 'blur',
      },
      {
        type: 'submit',
        label: '登录',
        props: {
          light: true,
        },
      },
    ]
  // };

  @User.State
  profile: UserEntity;

  @User.Action
  login: (payload) => void;

  @User.Action
  getUserInfo: () => void;

  async submitHandler(e: any) {
    e.preventDefault();
    const loadingPlugin = loading({ txt: 'Loading...' });
    try {
      await this.login(this.model);
      localStorage.setItem('fx_userName', this.model.username)
      this.$router.push({ name: '首页' });
      loadingPlugin.hide();
    } catch (error) {
      loadingPlugin.hide();
      toast({ txt: '用户名不存在或者密码错误', type: 'error', time: 2000 });
    }
  }
  validateHandler(result: any) {
    this.validity = result.validity;
    this.valid = result.valid;
  }

  /**
   * 注册页面
   */
  toRegister() {
    this.$router.push('register');
  }

  /**
   * 忘记密码页面
   */
  toResetPwd() {
    this.$router.push('resetPwd');
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
  margin-top: 14%;
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
  font-size 16px
  padding-left 86%

.cube-form
  background-color #fff0

.form >>> .cube-input
  background-color #fff0 !important
  color #fff

.form >>> .cube-form-label
  color #fff

.form >>> .cube-btn
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
.login-input >>> .cube-input-field
  padding: 13px 10px;
</style>

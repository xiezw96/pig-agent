<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { wx } from 'weixin-js-sdk';
import { userUnifiedorder } from '@/services/mall.service';
import Vue from 'vue';

const User = namespace('workspace/user');

@Component({
  async created() {
    const params = this.$route.query;
    if(!params) {
      return;
    }
    this.getOpenId(params);
  },
})

export default class AuthComponent extends Vue {

  @User.Action
  getUserOpenId: (payload) => void;

  @User.State
  openId: string;

  async getOpenId(params: any) {
    await this.getUserOpenId(params);
    if (this.openId) {
      this.$router.push({ name: '登陆' });
    }
  }
}
</script>


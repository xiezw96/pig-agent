<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { namespace } from 'vuex-class';

import wx from 'weixin-js-sdk';
import { userUnifiedorder, removeUserOrder, unifiedorder } from '@/services/mall.service';
import WxPay from '@/mixins/wx-pay';
import { toast } from '../utils';

const User = namespace('workspace/user');

@Component({
  async created() {
    const params = this.$route.query;
    if (!params) {
      return;
    }
    this.getOpenId(params);
  },
})
export default class AuthComponent extends Mixins(WxPay) {
  @User.Action
  getUserOpenId: (payload) => void;

  @User.State
  openId: string;

  async getOpenId(params: any) {
    await this.getUserOpenId(params);
    if (this.openId) {
      try {
        const orderResultData = await userUnifiedorder({
          openid: this.openId,
          qrStr: params.state,
        });
        const data = orderResultData.data;
        try {
          const result: any = await this.wxPay(data);
          if (result.errMsg === 'chooseWXPay:ok') {
            toast({txt: '请拿好物品，关好柜门。', type: 'correct', time: 3000});
            setTimeout(() => {
              wx.closeWindow();
            }, 3000);
          }
        } catch (error) {
          removeUserOrder({ code: data.outTradeNo, openid: this.openId });
          setTimeout(() => {
            wx.closeWindow();
          }, 3000);
        }
      } catch (error) {
        toast({txt: error.message, type: 'error', time: 3000});
        setTimeout(() => {
          wx.closeWindow();
        }, 3000);
      }
    }
  }
}
</script>


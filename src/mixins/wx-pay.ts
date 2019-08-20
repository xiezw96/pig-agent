import { Component, Vue } from 'vue-property-decorator';

import wx from 'weixin-js-sdk';

import { currentUserService, unifiedorder } from '@/services';
import { namespace } from 'vuex-class';
import { toast } from '@/utils';

const User = namespace('workspace/user');

@Component
export default class WxPay extends Vue {

  @User.State
  openId: string;

  async unifiedorder(orderNo: any) {
    if (!this.openId) {
      this.openId = sessionStorage.getItem('openId');
    }
    // 调用统一下单接口
    const orderResultData = await unifiedorder({
      openid: this.openId,
      ordercode: orderNo,
    });
    return orderResultData.data;
  }

  async wxPay(data: any) {
    const url = window.location.href;
    const wxConfig = await currentUserService.getJsapiSignature({ url });
    wx.config({
      ...wxConfig,
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      jsApiList: ['chooseWXPay'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    return new Promise((resolve, reject) => {
      wx.ready(() => {
        wx.chooseWXPay({
          ...data,
          timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySign, // 支付签名
          success(res: any) {
            resolve(res);
          },
          cancel(res: any) {
            reject(res);
          },
          fail(res: any) {
            toast({ txt: '支付失败,请稍后再试', type: 'error', time: 2000 });
            reject(res);
          },
        });
      });
    });
  }
}

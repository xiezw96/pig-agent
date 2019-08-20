import { agentService, smsService } from '@/services';
import { toast } from '@/utils';
import Vue from 'vue';

import Component from 'vue-class-component'

// You can declare a mixin as the same style as components.
@Component
export default class ValidateCodeMixin extends Vue {
  model: any = {
    smsToken: '',
  };
  async validCode() {
    const { data } = await smsService.token(this.model);
    if (!data.data) {
      toast({txt: '短信验证失败', type: 'error', time: 2000});
      return;
    }
    this.model.smsToken = data.data;
  }

  async sendCode() {
    const result = await smsService.sendCode(this.model);
    if (!result.data.data) {
      toast({txt: '短信发送失败', type: 'error', time: 2000});
    } else {
      toast({txt: '短信发送成功', type: 'correct', time: 2000});
    }
  }
}

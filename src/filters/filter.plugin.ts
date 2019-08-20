import { PluginObject, VueConstructor } from 'vue';

import { concatSpecName, getRemitStatusByCode } from '@/utils';

import { address } from './address.filter';
import { auditStatus } from './audit.status.filter';
import { b64toUrl } from './base64-to-url.filter';
import { getBoxStatusByCode } from './box-status.filter';
import { date } from './date.filter';
import { deviceStatus } from './device.status.filter';
import { image } from './image.filter';
import { join } from './join.filter';
import {
  getRewardAuditedStatusByCode,
  getWithdrawAuditedStatusByCode,
} from './reward-audited-status.filter';
import { sourceStatus } from './source.status.filter';

export class FilterPlugin implements PluginObject<never> {
  install(Vue: VueConstructor) {
    Vue.filter('address', address);
    Vue.filter('auditStatus', auditStatus);
    Vue.filter('date', date);
    Vue.filter('deviceStatus', deviceStatus);
    Vue.filter('image', image);
    Vue.filter('b64toUrl', b64toUrl);
    Vue.filter('join', join);
    Vue.filter('reward_audited_status', getRewardAuditedStatusByCode);
    Vue.filter('sourceStatus', sourceStatus);
    Vue.filter('boxstatus', getBoxStatusByCode);
    Vue.filter('spec', concatSpecName);
    Vue.filter('withdraw_audited_status', getWithdrawAuditedStatusByCode);
    Vue.filter('remit_status', getRemitStatusByCode);
  }
}

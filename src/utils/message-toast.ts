import Vue from 'vue';

import { Toast } from 'cube-ui';
import { ToastEntity } from './toastEntity';

Vue.use(Toast);
/**
 * toast 提示
 */
export function toast(msg: ToastEntity) {
  const toastPlugin = (Toast as any).$create({...msg});
  toastPlugin.show();
  return toastPlugin;
}




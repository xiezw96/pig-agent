import { Toast } from 'cube-ui';
import { assignIn } from 'lodash';
import Vue from 'vue';
import { ToastEntity } from './toastEntity';


Vue.use(Toast);
/**
 * toast 提示
 */
export function loading(msg: ToastEntity) {
  const entity = assignIn({time: 300000, mask: true}, {...msg});
  const loadingPlugin = (Toast as any).$create({...entity});
  loadingPlugin.show();
  return loadingPlugin;
}




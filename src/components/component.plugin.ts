import { PluginObject, VueConstructor } from 'vue';

import CubePage from './cube-page.vue';
import Spacer from './spacer.vue';

export class ComponentPlugin implements PluginObject<any> {
  install(Vue: VueConstructor) {
    Vue.component('cube-page', CubePage);
    Vue.component('app-spacer', Spacer);
  }
}

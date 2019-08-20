import { PluginObject, VueConstructor } from 'vue';
import VueLazyload from 'vue-lazyload';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import { ComponentPlugin } from '@/components';
import { CorePlugin } from '@/core';
import { FilterPlugin } from '@/filters';
import { PatchPlugin } from '@/patchs';

import { CubeUIPlugin } from './cube-ui.plugin';
import { ErudaPlugin } from './eruda-sync.plugin';
import './f2';

export class AppPlugin implements PluginObject<any> {
  install(Vue: VueConstructor) {
    Vue.use(VueRouter);
    Vue.use(Vuex);
    Vue.use(VueLazyload);
    Vue.use(new PatchPlugin());
    Vue.use(new CubeUIPlugin());
    Vue.use(new CorePlugin());
    Vue.use(new ComponentPlugin());
    Vue.use(new FilterPlugin());
    // Vue.use(new ErudaPlugin());
  }
}

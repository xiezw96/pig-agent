import '@material/elevation/dist/mdc.elevation.min.css';
import 'reflect-metadata';
import { Component, Vue } from 'vue-property-decorator';

import { AppPlugin } from '@/plugins';
import { router } from '@/router';
import { buildStore } from '@/store';

import App from './App.vue';
import './styles.styl';

Vue.config.productionTip = false;

Vue.use(new AppPlugin());

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

new Vue({
  router,
  store: buildStore(),
  render: h => h(App),
}).$mount('#app');

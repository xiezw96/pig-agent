import { Component, Vue } from 'vue-property-decorator';

@Component({
  render(h) {
    return h('router-view');
  },
})
export class RouteGroupComponent extends Vue {}

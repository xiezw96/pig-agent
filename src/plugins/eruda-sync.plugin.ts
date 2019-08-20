import eruda from 'eruda';
import dom from 'eruda-dom';
import { PluginObject } from 'vue';

export class ErudaPlugin implements PluginObject<any> {
  install() {
    eruda.init();
    eruda.add(dom);
  }
}

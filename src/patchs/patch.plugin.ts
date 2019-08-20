import { PluginObject } from 'vue';

import { fixResizeBug } from './ios.patch';

export class PatchPlugin implements PluginObject<any> {
  install() {
    fixResizeBug();
  }
}

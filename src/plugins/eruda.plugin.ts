import { fromEvent } from 'rxjs';
import { buffer, debounceTime, filter, map } from 'rxjs/operators';
import { PluginObject } from 'vue';

function loadErada() {
  import('eruda').then(eruda => {
    import('eruda-dom').then(erudaDom => {
      eruda.init();
      eruda.add(erudaDom);
    });
  });
}

export class ErudaPlugin implements PluginObject<any> {
  install() {
    if (process.env.NODE_ENV !== 'production') {
      loadErada();
    } else {
      // 生产模式下，快速连击10下，打开调试面板
      const touch$$ = fromEvent(window.document, 'touchend');
      touch$$
        .pipe(
          buffer(touch$$.pipe(debounceTime(300))),
          map(touchEvents => touchEvents.length),
          filter(count => count === 10),
        )
        .subscribe(() => {
          loadErada();
        });
    }
  }
}

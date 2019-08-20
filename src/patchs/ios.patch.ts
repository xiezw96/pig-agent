/**
 * 解决 iOS 下，关闭小键盘后，页面不回弹的问题
 *
 * 监听 `input` 元素的 `blur` 事件，当输入框失去焦点后手动触发页面滚动
 *
 * NOTE: `focus`/`blur` 事件不支持冒泡，但是支持捕获所以可以通过捕获阶段获取子元素的 `focus`/`blur` 事件
 */
export function fixResizeBug() {
  let timer = null;

  document.body.addEventListener(
    'focus',
    ev => {
      if (ev.target instanceof HTMLInputElement) {
        clearTimeout(timer);
      }
    },
    { capture: true },
  );

  document.body.addEventListener(
    'blur',
    ev => {
      if (ev.target instanceof HTMLInputElement) {
        timer = setTimeout(() => {
          const scrollHeight =
            document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 0);
      }
    },
    { capture: true },
  );
}

<template>
  <cube-page title="消息公告">
    <template #content>
      <div class="container">
        <cube-tab-bar
          class="static"
          v-model="selectedLabel"
          show-slider
          :use-transition="disabled"
          ref="tabNav"
          :data="tabLabels"
        >
        </cube-tab-bar>
        <cube-slide
          class="expand"
          ref="slide"
          :loop="loop"
          :initial-index="initialIndex"
          :auto-play="autoPlay"
          :show-dots="showDots"
          :options="slideOptions"
          @scroll="scroll"
          @change="changePage"
        >
          <!-- 公告 -->
          <cube-slide-item>
            <cube-scroll
              ref="noticeScroll"
              @pulling-up="noticePullingUp"
              :data="noticeData"
              :options="scrollOptions"
              style="100%;"
            >
              <ul class="list-wrapper">
                <li
                  v-for="(item, index) in noticeData"
                  class="list-item"
                  :key="index"
                  v-on:click="showClose(item)"
                >
                  <div class="hot-title">
                    <span></span>
                    {{ item.createDate }}
                  </div>
                  <div class="hot-content is-bold is-black">
                    {{ item.title }}
                  </div>
                </li>
              </ul>
            </cube-scroll>
          </cube-slide-item>
          <!-- 消息 -->
          <cube-slide-item>
            <cube-scroll
              ref="messageScroll"
              @pulling-up="messagePullingUp"
              :data="messageData"
              :options="scrollOptions"
            >
              <ul class="list-wrapper">
                <li
                  v-for="(item, index) in messageData"
                  class="list-item"
                  :key="index"
                  @click.prevent="showClose(item)"
                >
                  <div class="hot-title">
                    <span></span>
                    {{ item.createDate }}
                  </div>
                  <div class="hot-content is-bold is-black">
                    {{ item.title }}
                  </div>
                </li>
              </ul>
            </cube-scroll>
          </cube-slide-item>
        </cube-slide>
      </div>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
import CubePage from '@/components/cube-page.vue';
import { find, findIndex } from 'lodash';

import { noticeMessageService } from '@/services';
@Component<NoticeMessageComp>({
  components: {
    'cube-page': CubePage,
  },
  created() {
    // this.getSettlementTotal();
    this.getNoticeData();
    this.getMessageData();
  },
})
export default class NoticeMessageComp extends Vue {
  selectedLabel = '公告';
  disabled = false;
  tabLabels = [
    {
      label: '公告',
    },
    {
      label: '消息',
    },
  ];
  loop = false;
  autoPlay = false;
  showDots = false;
  slideOptions = {
    listenScroll: true,
    probeType: 3,
    /* lock y-direction when scrolling horizontally and  vertically at the same time */
    directionLockThreshold: 0,
  };
  scrollOptions = {
    /* lock x-direction when scrolling horizontally and  vertically at the same time */
    directionLockThreshold: 0,
  };
  indexListOptions = {
    pullUpLoad: true,
  };
  noticeData = [];
  messageData = [];
  async getNoticeData() {
    this.noticeData = await noticeMessageService.findNotice();
    console.log(this.noticeData);
  }
  async getMessageData() {
    this.messageData = await noticeMessageService.findMessage();
  }
  changePage(current) {
    this.selectedLabel = this.tabLabels[current].label;
  }
  scroll(pos) {
    const x = Math.abs(pos.x);
    const tabItemWidth = (this as any).$refs.tabNav.$el.clientWidth;
    const slideScrollerWidth = (this as any).$refs.slide.slide.scrollerWidth;
    const deltaX = (x / slideScrollerWidth) * tabItemWidth;
    (this as any).$refs.tabNav.setSliderTransform(deltaX);
  }
  showClose(item) {
    (this as any).dialog = this.$createDialog({
      type: 'alert',
      showClose: true,
      title: item.title,
      content: item.content,
    });
    (this as any).dialog.show();
    if (this.initialIndex === 1) {
      item.readStatus = 1;
      noticeMessageService.updateMessage(item);
      this.getMessageData();
    }
    // else {

    // }
  }
  noticePullingUp() {
    // Mock async load.
    // alert(11);
    const toast = (this as any).$createToast({
      time: 1000,
      txt: '加载更多数据....',
    });
    toast.show();
    setTimeout(() => {
      (this as any).$refs.indexList.forceUpdate();
    }, 1000);
  }
  messagePullingUp() {
    // Mock async load.
    // alert(11);
    const toast = (this as any).$createToast({
      time: 1000,
      txt: '加载更多数据....',
    });
    toast.show();
    setTimeout(() => {
      (this as any).$refs.indexList.forceUpdate();
    }, 1000);
  }
  get initialIndex() {
    let index = 0;
    index = findIndex(this.tabLabels, { label: this.selectedLabel });
    return index;
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.container
  display flex
  flex-direction column
  height 100%

.list-wrapper
  overflow hidden

  li
    padding 15px 10px
    margin-top 10px
    text-align left
    background-color white
    font-size 14px
    color #999
    white-space normal

    .line-height
      line-height 1.5

    .is-black
      color black

    .is-grey
      color #999

    .top
      display flex

      .avatar
        width 15px
        height 15px
        margin-right 2px
        border-radius 100%

      .time
        flex 1

    .middle
      display flex
      margin 10px 0
      color black

    .hot-title
      display flex
      align-items center
      font-size 12px

      .hot-sequence
        display inline-block
        margin-right 2px
        padding 3px 6px
        border-radius 2px
        background-color darkgoldenrod
        color white

    .hot-content
      margin-top 15px
</style>
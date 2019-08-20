<template>
  <cube-page title="我的代金券">
    <template #content>
      <div class="view-wrapper">
        <div class="index-list-wrapper custom">
          <cube-index-list
            ref="indexList"
            :data="list"
            :navbar="false"
            :pullUpLoad="true"
            @pulling-up="onPullingUp"
          >
            <cube-index-list-group
              v-for="(group, index) in list"
              :key="index"
              :group="group"
            >
              <cube-index-list-item
                v-for="(item, index) in group.items"
                :key="index"
                :item="item"
                @select="selectItem"
              >
                <div class="custom-item">
                  <img class="avatar" v-lazy="item.avatar" />
                  <span class="name">
                    <p class="title">{{ item.name }}</p>
                    <p class="content">使用条件：满{{ item.minPrice }}元使用</p>
                    <p class="content">有效期：{{ item.endTime | date }}</p>
                  </span>
                  <span class="status">{{
                    state === 0 ? '可用' : '不可用'
                  }}</span>
                </div>
              </cube-index-list-item>
            </cube-index-list-group>
            <!-- <span class="custom-nav-item" slot="nav-item" slot-scope="props">{{props.item}}</span> -->
          </cube-index-list>
        </div>
      </div>
    </template>
  </cube-page>
</template>

<script lang="ts">
import Vue from 'vue';
import CubePage from '@/components/cube-page.vue';

import { mapState, mapActions } from 'vuex';

export default Vue.extend({
  name: 'voucher',
  components: {
    CubePage,
  },
  data() {
    return {
      // singerData: singerData
    };
  },
  methods: {
    selectItem(item: any) {
      console.log(item.name);
    },
    clickTitle(title: any) {
      console.log(title);
    },
    onPullingUp() {
      // Mock async load.
      setTimeout(() => {
        (this as any).$refs.indexList.forceUpdate();
      }, 1000);
    },
  },
  computed: {
    ...mapState({
      list: state => (state as any).personal.coupon.list,
    }),
  },
});
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cube-index-list-anchor
  padding 0px 0px 0px 0px !important

.cube-index-list-item
  border-top 1px solid #eaeaee

.view-wrapper
  position fixed
  top 54px
  left 0
  bottom 0
  width 100%

  .index-list-wrapper
    height 98%
    width 94%
    margin 0 auto
    overflow hidden

    &.custom
      .cube-index-list-content
        // background-color: #222
        // color: #909090

      .cube-index-list-group
        padding-bottom 30px

      .custom-item
        display flex
        height 70px
        align-items center
        padding 12px 0 0 10px

        .avatar
          width 50px
          height 50px
          border-radius 50%
          margin-bottom 12px

        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium

          .title
            font-weight bold
            text-align left
            width 100%
            padding-left 5%

          .content
            text-align left
            font-size 12px

        .status
          padding-left 80%
          position absolute

      .custom-nav-item
        font-size 12px
        color #909090
</style>


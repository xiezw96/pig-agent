<template>
  <div class="cube-page" :class="type">
    <header class="header mdc-elevation--z4">
      <div class="left-area">
        <i @click="back" v-if="showBack" class="cubeic-back"></i>
        <slot name="left-area"></slot>
      </div>
      <div class="title">
        <slot name="titleArea">
          {{ title }}
        </slot>
      </div>
      <div class="right-area">
        <slot name="rightExtAction"></slot>
      </div>
    </header>
    <main class="content">
      <slot name="content">{{ content }}</slot>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'cube-page',
  props: {
    showBack: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
      required: true,
    },
    type: {
      type: String,
      default: 'sticky',
    },
    desc: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
  methods: {
    back() {
      this.$router.back();
    },
  },
});
</script>

<style lang="stylus" rel="stylesheet/stylus">
// @import "~@/common/stylus/variable.styl"
.cube-page
  position relative
  display flex
  flex-direction column
  width 100%
  height 100%
  background #efeff4

  .header
    position relative
    z-index 4
    display flex
    align-items center
    width 100%
    flex none
    height 48px
    text-align center
    color #fff
    background-color #4958f2
    border-bottom-right-radius 16px
    border-bottom-left-radius 16px
    font-size 20px

    .title
      flex 1.5 1 40%
      font-weight 700

    .left-area, .right-area
      display flex
      align-items center
      font-size 120%

    .left-area
      height 100%
      padding-left 16px
      flex 1 1 30%
      text-align left

    .right-area
      flex 1 1 30%
      height 100%
      padding-right 16px
      justify-content flex-end
      text-align right

  .content
    position relative
    flex auto
    height 100%
    padding 10px
    overflow-y scroll
</style>
<template>
  <div class="app-raw">{{ text }}</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class RawComponent extends Vue {
  @Prop()
  text: string;
}
</script>

<style lang="stylus" scoped>
.app-raw
  display flex
  height 100%
  align-items center
  justify-content flex-end
</style>


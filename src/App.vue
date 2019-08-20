<template>
  <div id="app">
    <global-error-handler>
      <router-view />
    </global-error-handler>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { GlobalErrorHandlerComponent } from '@/core';

@Component({
  components: {
    GlobalErrorHandler: GlobalErrorHandlerComponent,
  },
})
export default class AppComponent extends Vue {}
</script>

<style lang="stylus">
#app
  height 100%
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
</style>

<template>
  <div>
    <cube-input v-model="value" @change="changeValue">
      <div style="padding-right: 4%;" placeholder="请输入验证码" slot="append">
        <cube-button :inline="true" @click="send" :disabled="sendValidButtonDisable">
          {{buttonTitle}}
        </cube-button>
      </div>
    </cube-input>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'send-code',
  model: {
    prop: 'newvalue',
    event: 'change'
  },
  data() {
    return {
      value: '',
      countDown: 60,
      sendValidButtonDisable: false,
      buttonTitle: this.title,
    }
  },
  props: {
    title: {
     type: String,
     default: '发送短信'
    }
  },
  methods: {
    async send() {
      const timer = setInterval(() => {
        if (this.countDown === 0) {
          this.countDown = 60;
          this.buttonTitle = '获取验证码';
          this.sendValidButtonDisable = false;
          clearInterval(timer);
          return;
        }
        const count = this.countDown--;
        this.sendValidButtonDisable = true;
        this.buttonTitle = count + 's';
      }, 1000);
      this.$emit('send');
    },
    changeValue() {
      this.$emit('change', this.value);
    }
  },
})
</script>

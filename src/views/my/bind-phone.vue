<template>
  <cube-page title="绑定手机">
    <div slot="content">
      <div class="form">
        <cube-form
          :model="model"
          :schema="schema"
          :immediate-validate="false"
          @validate="validateHandler"
          @submit="submitHandler"
        >
        </cube-form>
      </div>
      <div style="padding-top: 5%;" class="form">
        <cube-form
          :model="bindModel"
          :schema="bindSchema"
          :immediate-validate="false"
          @validate="bindValidateHandler"
          @submit="bindSubmitHandler"
        >
        </cube-form>
      </div>
    </div>
  </cube-page>
</template>
<script lang="ts">
import Vue from 'vue';

import CubePage from '@/components/cube-page.vue';
import SendCode from '@/components/send-code.vue';

export default Vue.extend({
  name: 'bind-phone',
  components: {
    CubePage,
    SendCode,
  },
  data(this: any) {
    return {
      validity: {},
      valid: undefined,
      model: {
        id: '',
        username: '',
        validCode: '',
      },
      schema: {
        fields: [
          {
            type: 'input',
            modelKey: 'username',
            label: '手机号',
            props: {
              type: 'number',
              placeholder: '请输入11位手机号',
              disabled: true,
            },
            rules: {
              type: 'tel',
              required: true,
            },
            trigger: 'blur',
          },
          {
            component: SendCode,
            modelKey: 'validCode',
            events: {
              send: this.send,
            },
            label: '验证码',
            rules: {
              type: 'number',
              required: true,
            },
            props: {
              title: '发送短信',
            },
          },
          {
            type: 'submit',
            label: '解绑',
          },
        ],
      },
      bindModel: {
        username: '',
        validCode: '',
      },
      bindSchema: {
        fields: [
          {
            type: 'input',
            modelKey: 'username',
            label: '新手机号',
            props: {
              type: 'number',
              placeholder: '请输入11位手机号',
            },
            rules: {
              type: 'tel',
              required: true,
            },
            trigger: 'blur',
          },
          {
            component: SendCode,
            modelKey: 'validCode',
            events: {
              send: this.send,
            },
            label: '验证码',
            rules: {
              type: 'number',
              required: true,
            },
            props: {
              title: '发送短信',
            },
          },
          {
            type: 'submit',
            label: '提交',
          },
        ],
      },
    };
  },
  methods: {
    submitHandler(e: any) {
      e.preventDefault();
      if (!this.valid) return;
    },
    validateHandler(result: any) {
      this.validity = result.validity;
      this.valid = result.valid;
    },
    bindSubmitHandler(e: any) {
      e.preventDefault();
      if (!this.valid) return;
      console.log(this.model);
      console.log('submit', e);
    },
    bindValidateHandler(result: any) {
      this.validity = result.validity;
      this.valid = result.valid;
    },
  },
});
</script>

<style lang="stylus" scoped>
.title
  padding-top 15%
</style>

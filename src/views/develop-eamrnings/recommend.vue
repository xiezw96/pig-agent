<template>
  <cube-page title="认证信息">
    <template #content>
      <div class="form">
        <cube-form
          ref="form"
          :model="model"
          :schema="schema"
          :immediate-validate="false"
          @submit="submitHandler"
        >
        </cube-form>
      </div>
    </template>
  </cube-page>
</template>
<script lang="ts">
import { get } from 'lodash';
import Vue from 'vue';

import { recommand } from '@/services/develop-eamrnings.service';
import CubePage from '@/components/cube-page.vue';

const idreg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

const initModel = {
  name: '',
  phone: '',
  wechatId: '',
  idCard: '',
  identityCardFront: [],
  identityCardVerso: [],
  bankCardFront: [],
  bankCardVerso: [],
};

export default Vue.extend({
  name: 'develop-eamrnings-recommend',
  components: {
    CubePage,
  },
  data(this: any) {
    return {
      validity: {},
      valid: undefined,
      model: {
        name: '',
        phone: '',
        wechatId: '',
        idCard: '',
        identityCardFront: [],
        identityCardVerso: [],
        bankCardFront: [],
        bankCardVerso: [],
      },
      schema: {
        fields: [
          {
            type: 'input',
            modelKey: 'name',
            label: '姓名',
            props: {
              placeholder: '请输入姓名',
            },
            rules: {
              max: 20,
              min: 2,
              required: true,
            },
            trigger: 'blur',
          },
          {
            type: 'input',
            modelKey: 'phone',
            label: '手机号',
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
            type: 'input',
            modelKey: 'wechatId',
            label: '微信号',
            props: {
              placeholder: '请输入微信号',
            },
            rules: {
              max: 50,
            },
          },
          {
            type: 'input',
            modelKey: 'idCard',
            label: '身份证号码',
            props: {
              type: 'text',
              placeholder: '身份证号码',
            },
            rules: {
              required: true,
              pattern: new RegExp(idreg),
            },
            messages: {
              pattern: '身份证号码格式有误.',
            },
            trigger: 'blur',
          },
          {
            type: 'upload',
            modelKey: 'identityCardFront',
            label: '身份证正面',
            props: {
              max: 1,
              multiple: false,
              action: {
                target: 'api/admin/file',
                checkSuccess: this.checkSuccess,
                headers:{
                  Authorization: `Bearer ${ this.$store.state.workspace.user.accessToken }`
                }
              },
            },
            rules: {
              required: true,
            },
            events: {
              'file-success': (...args) => {
                console.log(args);
              },
            },
          },
          {
            type: 'upload',
            modelKey: 'identityCardVerso',
            label: '身份证反面',
            props: {
              max: 1,
              multiple: false,
              action: {
                target: 'api/admin/file',
                checkSuccess: this.checkSuccess,
                headers:{
                  Authorization: `Bearer ${ this.$store.state.workspace.user.accessToken }`
                }
              },
            },
            rules: {
              required: true,
            },
            events: {},
          },
          {
            type: 'upload',
            modelKey: 'bankCardFront',
            label: '银行卡正面',
            props: {
              max: 1,
              multiple: false,
              action: {
                target: 'api/admin/file',
                checkSuccess: this.checkSuccess,
                headers:{
                  Authorization: `Bearer ${ this.$store.state.workspace.user.accessToken }`
                }
              },
            },
            rules: {
              required: true,
            },
          },
          {
            type: 'upload',
            modelKey: 'bankCardVerso',
            label: '银行卡反面',
            props: {
              max: 1,
              multiple: false,
              action: {
                target: 'api/admin/file',
                checkSuccess: this.checkSuccess,
                headers:{
                  Authorization: `Bearer ${ this.$store.state.workspace.user.accessToken }`
                }
              },
            },
            rules: {
              required: true,
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
    async submitHandler(e) {
      e.preventDefault();
      const {
        identityCardFront,
        identityCardVerso,
        bankCardFront,
        bankCardVerso,
        ...rest
      } = this.model;

      await recommand({
        ...rest,
        identityCardFront: this.getImageData(identityCardFront),
        identityCardVerso: this.getImageData(identityCardVerso),
        bankCardFront: this.getImageData(bankCardFront),
        bankCardVerso: this.getImageData(bankCardVerso),
      });

      this.model = initModel;

      const toast = this.$createToast({
        txt: '推荐成功',
        type: 'correct',
      });

      toast.show();
    },
    checkSuccess(res, file) {
      return res.code === 0;
    },
    getImageData(item) {
      return get(item, '0.response.data');
    },
  },
});
</script>

<style lang="stylus" scoped>
.title
  padding-top 15%
</style>

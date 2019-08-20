<template>
  <cube-page title="认证信息">
    <template #content>
      <div class="form">
        <cube-form
          :model="model"
          :immediate-validate="true"
          @validate="validateHandler"
          @submit="submitHandler"
        >
          <cube-form-group>
            <cube-form-item :field="fields[0]">
              <cube-input
                v-model="model.name"
                placeholder="请输入姓名"
                :disabled="formDisable"
              ></cube-input>
            </cube-form-item>
            <cube-form-item :field="fields[1]">
              <cube-input
                v-model="model.phone"
                type="number"
                placeholder="请输入11位手机号"
              ></cube-input>
            </cube-form-item>
            <cube-form-item :field="fields[2]">
              <cube-input
                v-model="model.wechatId"
                placeholder="请输入微信号"
              ></cube-input>
            </cube-form-item>
            <cube-form-item :field="fields[3]">
              <cube-input
                v-model="model.idCard"
                placeholder="请输入身份证号"
                :disabled="formDisable"
              ></cube-input>
            </cube-form-item>
            <cube-form-item :field="fields[4]">
              <cube-input
                v-model="model.bankAccountName"
                placeholder="请输入开户名"
              ></cube-input>
            </cube-form-item>
            <cube-form-item :field="fields[5]"></cube-form-item>
            <cube-form-item :field="fields[6]"></cube-form-item>
            <cube-form-item :field="fields[7]"></cube-form-item>
            <cube-form-item :field="fields[8]"></cube-form-item>
          </cube-form-group>
          <cube-form-group>
            <cube-button type="submit">提交</cube-button>
          </cube-form-group>
        </cube-form>
      </div>
    </template>
  </cube-page>
</template>
<script lang="ts">
import { get } from 'lodash';
import { Component, Vue } from 'vue-property-decorator';

import CubePage from '@/components/cube-page.vue';
import { store } from '@/store';

import { agentService, developmentRewordAuditingService } from '@/services';
import { toast } from '@/utils';

const idreg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

@Component({
  components: {
    CubePage,
  },
  beforeRouteEnter(_to, _from, next) {
    const { agentInfo } = store.state.workspace.user;
    if (agentInfo.activeStatus === 0 && agentInfo.auditStatus === 1) {
      next({ name: '激活套餐' });
      return;
    }

    next();
    return;
  },
  created() {
    this.getUserAgent()
  },
})
export default class AuthInfoComponent extends Vue {
  validity = {};
  valid = undefined;
  formDisable = false;
  model = {
    agentId: 0,
    name: '',
    phone: '',
    wechatId: '',
    idCard: '',
    bankAccountName: '',
    auditStatus: undefined,
    uploadIdentityCardFront: [],
    uploadIdentityCardVerso: [],
    uploadBankCardFront: [],
    uploadBankCardVerso: [],
  };
  fields = [
    {
      modelKey: 'name',
      label: '姓名',
      rules: {
        min: 2,
        max: 6,
        required: true,
      },
      trigger: 'blur',
    },
    {
      modelKey: 'phone',
      label: '开户手机号',
      rules: {
        type: 'tel',
        required: true,
      },
      trigger: 'blur',
    },
    {
      modelKey: 'wechatId',
      label: '微信号',
      rules: {
        max: 50,
      },
    },
    {
      modelKey: 'idCard',
      label: '身份证号码',
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
      modelKey: 'bankAccountName',
      label: '开户名',
      rules: {
        required: true,
        min: 2,
        max: 50,
      },
      trigger: 'blur',
    },
    {
      type: 'upload',
      modelKey: 'uploadIdentityCardFront',
      label: '身份证正面',
      props: {
        max: 1,
        multiple: false,
        accept: 'image/*',
        action: {
          target: 'api/admin/file',
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
      modelKey: 'uploadIdentityCardVerso',
      label: '身份证反面',
      props: {
        max: 1,
        multiple: false,
        accept: 'image/*',
        action: {
          target: 'api/admin/file',
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
      modelKey: 'uploadBankCardFront',
      label: '银行卡正面',
      accept: 'image/*',
      props: {
        max: 1,
        multiple: false,
        accept: 'image/*',
        action: {
          target: 'api/admin/file',
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
      modelKey: 'uploadBankCardVerso',
      label: '银行卡反面',
      accept: 'image/*',
      props: {
        max: 1,
        multiple: false,
        accept: 'image/*',
        action: {
          target: 'api/admin/file',
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
  ];

  async getUserAgent() {
    const data: any = await agentService.get();
    const {
      identityCardFront,
      identityCardVerso,
      bankCardFront,
      bankCardVerso,
    } = data;
    this.model.agentId = data.agentId;
    this.model.name = data.name;
    this.model.phone = data.phone;
    this.model.bankAccountName = data.bankAccountName;
    this.model.wechatId = data.wechatId;
    this.model.idCard = data.idCard;
    this.model.auditStatus = data.auditStatus;

    this.model.uploadIdentityCardFront =
      identityCardFront !== null
        ? [
            {
              url: this.atob(identityCardFront),
              status: 'success',
              response: {
                data: identityCardFront,
              },
            },
          ]
        : [];
    this.model.uploadIdentityCardVerso =
      identityCardVerso !== null
        ? [
            {
              url: this.atob(identityCardVerso),
              status: 'success',
              response: {
                data: identityCardVerso,
              },
            },
          ]
        : [];
    this.model.uploadBankCardFront =
      bankCardFront !== null
        ? [
            {
              url: this.atob(bankCardFront),
              status: 'success',
              response: {
                data: bankCardFront,
              },
            },
          ]
        : [];
    this.model.uploadBankCardVerso =
      bankCardVerso !== null
        ? [
            {
              url: this.atob(bankCardVerso),
              status: 'success',
              response: {
                data: bankCardVerso,
              },
            },
          ]
        : [];
    if (this.model.auditStatus === 0 || this.model.auditStatus === 1) {
      this.formDisable = true;
    }
  }

  async submitHandler(e: any) {
    e.preventDefault();
    if (!this.valid) return;

    const {
      uploadIdentityCardFront: [uploadIdentityCardFront],
      uploadIdentityCardVerso: [uploadIdentityCardVerso],
      uploadBankCardFront: [uploadBankCardFront],
      uploadBankCardVerso: [uploadBankCardVerso],
      ...rest
    } = this.model;
    if (!uploadIdentityCardFront || !uploadIdentityCardVerso) {
      toast({ txt: '请上传身份证正反面照片', type: 'error', time: 2000 });
      return;
    }
    if (!uploadBankCardFront || !uploadBankCardVerso) {
      toast({ txt: '请上传银行卡正反面照片', type: 'error', time: 2000 });
      return;
    }
    const identityCardFront = uploadIdentityCardFront.response.data;
    const identityCardVerso = uploadIdentityCardVerso.response.data;
    
    const bankCardFront = uploadBankCardFront.response.data;
    const bankCardVerso = uploadBankCardVerso.response.data;
    

    const result: any = await agentService.requestUpdate(rest.agentId, {
      ...rest, identityCardFront, identityCardVerso, bankCardFront, bankCardVerso
    });
    if (!result.data) {
      toast({ txt: '修改失败', type: 'error', time: 2000 });
      return;
    }
    toast({ txt: '已提交审核，请耐心等待', type: 'correct', time: 2000 });
    this.formDisable = true;
  }

  validateHandler(result: any) {
    this.validity = result.validity;
    this.valid = result.valid;
  }

  atob(encoded) {
    if (!encoded) return;
    return atob(encoded);
  }
}
</script>

<style lang="stylus" scoped>
.title
  padding-top 15%
</style>

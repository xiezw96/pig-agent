<template>
  <cube-page title="故障">
    <template #content>
      <cube-form
        ref="form"
        style="text-align: left;"
        :model="formValues"
        :schema="formGroup"
        @submit.prevent="onSubmit()"
      ></cube-form>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { reportMalfunction } from '../../services';

@Component({})
export default class Malfunction extends Vue {
  @Prop()
  machineId: string;

  formValues = {
    faultType: undefined,
    aisleId: undefined,
    remark: undefined,
    images: [],
  };

  pics = new Map();

  get formGroup() {
    const fields: any[] = [
      {
        label: '故障类型',
        modelKey: 'faultType',
        type: 'select',
        props: {
          options: [
            {
              text: '整机故障',
              value: 1,
            },
            {
              text: '货道故障',
              value: 2,
            },
            {
              text: '其他',
              value: 3,
            },
          ],
        },
        rules: {
          required: true,
        },
        events: {
          input: this.onSelectType,
        },
      },
      {
        label: '故障描述',
        modelKey: 'remark',
        type: 'textarea',
        props: {
          placeholder: '简单描述故障现象',
          maxlength: 140,
        },
        rules: {
          required: true,
        },
      },
      {
        label: '故障照片',
        modelKey: 'images',
        type: 'upload',
        props: {
          max: 5,
          accept: 'image/*',
          action: {
            target: 'api/admin/file',
            headers:{
              Authorization: `Bearer ${ this.$store.state.workspace.user.accessToken }`
            }
          },
        },
      },
      {
        label: '提交',
        type: 'submit',
      },
    ];

    if (this.formValues.faultType === 2) {
      fields.splice(1, 0, {
        label: '故障货道',
        modelKey: 'aisleId',
        type: 'select',
        props: {
          options: [
            {
              text: '货道1',
              value: 1,
            },
          ],
        },
        rules: {
          required: true,
        },
      });
    }

    return {
      fields: [...fields],
    };
  }

  async onSubmit() {
    const valid = await (this.$refs.form as any).validate();
    if (!valid) return;

    const dto = { ...this.formValues, machineId: this.machineId };

    const loadingRef = this.loading();
    try {
      await reportMalfunction(dto);

      await this.alert();

      this.$router.back();
    } finally {
      loadingRef.hide();
    }
  }

  onSelectType(value) {
    if (value !== 2) {
      this.formValues.aisleId = undefined;
    }
  }

  loading() {
    return this.$createToast({
      time: 0,
      txt: '提交中',
    }).show();
  }

  alert() {
    return new Promise(resolve => {
      this.$createDialog({
        type: 'alert',
        title: '提示',
        content: '故障已申报',
        onConfirm: () => {
          resolve();
        },
      });
    });
  }
}
</script>


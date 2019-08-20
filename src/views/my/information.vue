<template>
  <cube-page title="我的资料">
    <template #content>
      <cube-form
        ref="form"
        style="text-align: left;"
        :model="model"
        :schema="formGroup"
      >
      </cube-form>
    </template>
  </cube-page>
</template>
<script lang="ts">
import { parse, format, subYears } from 'date-fns';
import { cloneDeep, get } from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { agentService } from '@/services';
import { AgentEntity } from '@/entities';
import { toast } from '@/utils';
import DatePickerComponent from '@/components/date-picker.vue';
import { store } from '@/store';

@Component<PersonnalInfoComp>({
  created() {
    this.getUserAgent();
  },
})
export default class PersonnalInfoComp extends Vue {
  model: any = {
    id: '',
    name: '',
    sex: '',
    referralCode: '',
    birthday: new Date(),
    photo: [],
  };

  formGroup = {
    groups: [
      {
        fields: [
          {
            type: 'input',
            modelKey: 'name',
            label: '姓名',
            props: {
              placeholder: '请输入姓名',
              readonly: true,
            },
          },
          {
            type: 'input',
            modelKey: 'referralCode',
            label: '推荐码',
            props: {
              readonly: true,
            },
          },
          {
            type: 'select',
            modelKey: 'sex',
            label: '性别',
            props: {
              options: [
                { value: 0, text: '男' },
                { value: 1, text: '女' },
                { value: 2, text: '保密' },
              ],
              placeholder: '请选择性别',
            },
          },
          {
            component: DatePickerComponent,
            modelKey: 'birthday',
            label: '生日',
            props: {
              min: subYears(new Date(), 150),
              max: new Date(),
              placeholder: '请选择日期',
            },
          },
          {
            type: 'upload',
            modelKey: 'photo',
            label: '头像',
            props: {
              max: 1,
              auto: true,
              multiple: false,
              required: true,
              action: {
                target: 'api/admin/file',
                headers: {
                  Authorization: `Bearer ${
                    this.$store.state.workspace.user.accessToken
                  }`,
                },
              },
            },
          },
          {
            label: '提交',
            type: 'submit',
            events: {
              click: this.onSubmit,
            },
          },
        ],
      },
    ],
  };

  async getUserAgent() {
    const result: any = await agentService.get();
    this.model.id = result.agentId;
    this.model.name = result.name;
    this.model.sex = result.sex;
    this.model.referralCode = result.referralCode;
    this.model.birthday = parse(result.birthday);
    this.model.photo = [
      {
        url: atob(result.photo),
        response: {
          data: result.photo,
        },
      },
    ];
  }

  async onSubmit() {
    if (!(this.$refs.form as any).validate()) return;
    const dto = {
      id: this.model.id,
      name: this.model.name,
      sex: this.model.sex,
      photo: get(this.model, 'photo.0.response.data'),
      birthday: format(this.model.birthday, 'YYYY-MM-DD'),
    };

    const result: any = await agentService.edit(dto.id, dto);
    if (!result.data) {
      toast({ txt: '修改失败', type: 'error', time: 2000 });
      return;
    }
    toast({ txt: '修改成功', type: 'correct', time: 2000 });
    const agent = await agentService.get();
    store.commit('workspace/user/setAgentInfo', agent);
  }
}
</script>

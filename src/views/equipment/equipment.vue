<template>
  <cube-page title="我的柜子">
    <template #rightExtAction>
      <i @click="onShowSearchFormPopup()" class="cubeic-search"></i>
    </template>
    <template slot="content">
      <div style="height: 100%;">
        <cube-scroll>
          <div class="indexContent" v-for="(item, index) in list" :key="index">
            <div class="data-item">
              <span class="left">柜子编码 :{{ item.code }}</span>
              <span class="right">
                状态: {{ item.status | deviceStatus }}
              </span>
            </div>
            <ul>
              <li>
                <span class="left">所属人</span>
                <span class="right">{{ item.belongs }}</span>
              </li>
              <li>
                <span class="address">
                  激活地址：{{ item.activateAddress }}
                </span>
              </li>
              <li>
                <span class="address"> 当前地址：{{ item.currAddreaa }} </span>
              </li>
              <li>
                <span class="left">激活日期</span>
                <span class="right">{{ item.activateTime }}</span>
              </li>
              <li>
                <span class="left"></span>
                <span class="right" style="padding: 2%;">
                  <cube-button
                    style="margin-right:10px;"
                    :inline="true"
                    @click="goSaveTemplate(item)"
                    >存为模板</cube-button
                  >
                  <cube-button
                    :inline="true"
                    @click="onNavigateToEquipment(item)"
                    >货道管理</cube-button
                  >
                </span>
              </li>
            </ul>
          </div>
        </cube-scroll>
      </div>

      <cube-popup
        type="search-form-popup"
        position="bottom"
        maskClosable
        ref="searchFormPopup"
      >
        <cube-form
          :model="searchForm"
          :schema="searchFormGroup"
          @submit.prevent="onSearch()"
        ></cube-form>
      </cube-popup>
    </template>
  </cube-page>
</template>

<script lang="ts">
import axios from 'axios';
import { Popup } from 'cube-ui';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

import { salesmachine, templateService } from '@/services';
import DateRangePickerComponent from '@/components/date-range-picker.vue';
import { toast } from '@/utils';

const Equipment = namespace('equipment');
const User = namespace('workspace/user');

@Component<EquipmentComponent>({
  async created() {
    this.list = await this.getEquipments();
  },
})
export default class EquipmentComponent extends Vue {
  @User.State
  agentInfo;

  list: any[] = [];

  searchForm = {
    code: '',
    currAddreaa: '',
    activateAddress: '',
    belongsUser: '',
    activateTime: [],
  };

  searchFormGroup = {
    fields: [
      {
        label: '柜子编码',
        modelKey: 'code',
        type: 'input',
        props: {
          type: 'text',
          placeholder: '请输入柜子编码',
        },
        rules: {
          type: 'string',
          max: 20,
        },
      },
      {
        label: '激活地址',
        modelKey: 'activateAddress',
        type: 'input',
        props: {
          placeholder: '请输入激活地址',
        },
        rules: {
          type: 'string',
          max: 50,
        },
      },
      {
        label: '当前地址',
        modelKey: 'currAddreaa',
        type: 'input',
        props: {
          placeholder: '请输入当前地址',
        },
        rules: {
          type: 'string',
          max: 20,
        },
      },
      {
        label: '所属人',
        modelKey: 'belongs',
        type: 'input',
        props: {
          placeholder: '请输入所属人',
        },
        rules: {
          type: 'string',
          max: 20,
        },
      },
      {
        label: '激活日期',
        modelKey: 'activateTime',
        component: DateRangePickerComponent,
        props: {
          placeholder: '请选择激活日期',
        },
      },
      {
        label: '查询',
        type: 'submit',
      },
    ],
  };

  $refs: {
    searchFormPopup: Popup;
  };

  onShowSearchFormPopup() {
    this.$refs.searchFormPopup.show();
  }

  async onSearch(e: any) {
    this.$refs.searchFormPopup.hide();

    const { activateTime, ...rest } = this.searchForm;

    const dto: any = { ...rest };

    if (activateTime.length !== 0) {
      const [start, end] = activateTime;
      dto.activateStartTime = format(startOfDay(start), 'YYYY-MM-DD HH:mm:ss');
      dto.activateEndTime = format(endOfDay(end), 'YYYY-MM-DD HH:mm:ss');
    }

    const loading = this.loading();

    try {
      this.list = await this.getEquipments(dto);
    } finally {
      loading.hide();
    }
  }

  onNavigateToEquipment(equipment) {
    if (equipment.belongsUser !== this.agentInfo.agentId) return;

    this.$router.push({
      name: '货道管理',
      params: { equipmentId: equipment.id },
    });
  }

  private async getEquipments(dto) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/salesmachine/agent/page', { params: dto });

    return records;
  }

  private loading() {
    return this.$createToast({
      time: 0,
    }).show();
  }
  goSaveTemplate(equipment) {
    this.$createDialog({
      type: 'prompt',
      title: '请填写模板名称',
      prompt: {
        value: '',
        placeholder: '请输入模板名称',
      },
      onConfirm: (e, value) => {
        const loading = this.loading();
        this.saveTemplate(value, equipment.id);
        loading.hide();
      },
    }).show();
  }
  async saveTemplate(name, machineId) {
    await templateService.saveTemplate({ name, machineId });
    toast({ txt: '设置成功', time: 1500 });
  }
}
</script>

<style lang="stylus" scoped>
@require '~@/theme.styl'

.data-item
  display flex
  height 32px
  align-items center
  font-size 13px
  padding 2px 0 0 10px
  background-color $secondary-color
  border-top-left-radius $border-radius
  border-top-right-radius $border-radius

.left
  text-align left
  width 55%

.right
  width 50%
  text-align right
  padding-right 3%

.indexContent
  background-color #fff
  border-radius $border-radius

  & + &
    margin-top 8px

  ul
    font-size 13px

    li
      width 100%
      line-height 32px
      border-top 1px solid #efeff4
      display flex

      .left
        padding-left 4%

      .address
        width 100%
        text-align left
        padding-left 4%
</style>

<template>
  <cube-page title="补货模板">
    <template slot="content">
      <cube-scroll style="flex: auto;">
          <div
            v-for="item in templates"
            :key="item.id"
            class="indexContent"
          >
            <div class="data-item" @click="toDetail(item)">
              <div class="data-price">
                <span class="left">模板名称:{{ item.name }}</span>
              </div>
              <div class="data-price">
                <span class="left">设备型号:{{ item.machineTypeName }}</span>
                <span class="operation"><i class="cubeic-arrow"></i></span>
              </div>
            </div>
            <div class="button">
              <cube-button :inline="true" @click="onRemove(item)">删除</cube-button>
            </div>
          </div>
      </cube-scroll>
    </template>
  </cube-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';

import { templateService } from '@/services';

import { provinceList, cityList, areaList } from '@/constants/areas';
import { toast } from '../../utils';
const asyncProvinceList = provinceList.slice();
const asyncCityList = JSON.parse(JSON.stringify(cityList));
const asyncAreaList = JSON.parse(JSON.stringify(areaList));

@Component<MachineTemplateComp>({
  name: 'machine-template',
  components: {
    'cube-page': CubePage,
  },
  created() {
    this.getAllTemplate();
  },
})
export default class MachineTemplateComp extends Vue {
  templates: any[] = [];
  async getAllTemplate() {
    const loading = this.loading();
    try{
      this.templates = await templateService.getTemplatePage();
    }finally{
    loading.hide();
    }
  }
  
  async onRemove(item) {
    this.$createActionSheet({
      title: '确认要删除吗',
      active: 0,
      data: [{ content: '删除' }],
      onSelect: () => {
        this.remove(item);
      },
    }).show();
  }

  async remove(item) {
    await templateService.remove(item.id);
    this.getAllTemplate();
  }
  
  toDetail(item) {
    this.$router.push({name: '模板详情', params: { templateId: item.id }});
  }
   private loading() {
    return this.$createToast({
      time: 0,
      txt: '加载中...',
    }).show();
  }
}
</script>

<style lang="stylus" scoped>
.indexContent
  background-color #fff
  margin-bottom 8px
.data-item
  border-bottom 1px solid #efeff4

.left
  text-align left
  width 90%

.operation
  width 10%
  text-align right
  padding-right 2%
  margin-top -22px

.data-price
  display flex
  height 34px
  align-items center
  font-size 14px
  padding 0 0 0 10px
  background-color #fff

.button
  text-align right
  padding 2%
</style>

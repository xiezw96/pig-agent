<template>
  <cube-page title="模板详情">
    <template slot="content">
      <!-- <cube-scroll style="flex: auto;"> -->
          <div
            v-for="item in template.templateDetails"
            :key="item.id"
            class="indexContent"
          >
            <div class="data-item">
              <span class="left">货道编号:{{ item.aisleCode }}</span>
            </div>
            <div class="data-item">
              <span class="left">商品名称:{{ item.goodsName }}</span>
            </div>
            <div class="data-item">
              <span class="left">商品编号:{{ item.goodsCode }}</span>
            </div>
          </div>
        <!-- </cube-scroll> -->
    </template>
  </cube-page>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';

import { templateService } from '@/services';

import { provinceList, cityList, areaList } from '@/constants/areas';
const asyncProvinceList = provinceList.slice();
const asyncCityList = JSON.parse(JSON.stringify(cityList));
const asyncAreaList = JSON.parse(JSON.stringify(areaList));

@Component<MachineTemplateComp>({
  name: 'machine-template',
  components: {
    'cube-page': CubePage,
  },
  created() {
    const params = this.$route.params;
    if (!params) return;
    this.templateId = params.templateId;
    this.getTemplateDetail();
  },
})
export default class MachineTemplateComp extends Vue {
  
  templateId: any = '';

  template: any[] = [];
  async getTemplateDetail() {
    const loading = this.loading();
    this.template = await templateService.getTemplateDetail(this.templateId);
    loading.hide();
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
  + .indexContent
    border-top 1px solid #efeff4

.left
  text-align left
  margin 10px
  width 100%
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

.data-item
  display flex
  height 34px
  font-size 14px
  border-top 1px solid #efeff4
  background-color #fff
</style>

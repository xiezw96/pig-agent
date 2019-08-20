<template>
  <cube-page title="货道管理">
    <i slot="rightExtAction" class="cubeic-add" @click="goTemplate"></i> 
    <template #content>
      <cube-scroll style="height: 100%;">
        <box-info
          class="list"
          v-for="box in boxes"
          :key="box.id"
          :box="box"
          :stock="box.aisleGoods"
          @click="onReload(box.id)"
          @remove="onRemove($event)"
          @refresh="refreshData"
        ></box-info>
      </cube-scroll>
      <cube-popup ref="templateSelector" maskClosable position="bottom">
        <div class="template-content">
          <div
            v-for="template in templates"
            :key="template.id"
            class="template-item"
            @click="onSelectTemplate(template.id)"
          >
            <div class="item-content">
              <p>模板名称: {{ template.name }}</p>
              <p>设备类型: {{ template.machineTypeName }}</p>
            </div>
          </div>
        </div>
      </cube-popup>
    </template>
  </cube-page>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Popup } from 'cube-ui';
import RawComponent from '@/components/raw.vue';
import { fetchEquipment, templateService } from '@/services';
import BoxInfo from './box-info.vue';
import { debounce } from 'rxjs/operators';
import { toast } from '../../utils';

const Equipment = namespace('equipment');

@Component<BoxListComponent>({
  components: {
    BoxInfo,
  },
  async created() {
    this.getBoxes();
    this.getTemplates();
  },
})
export default class BoxListComponent extends Vue {
  @Prop()
  equipmentId;

  boxes: any[] = [];
  templates: any[] = [];

  onReload(id) {
    this.$router.push({
      name: '开柜补货',
      params: { equipmentId: this.equipmentId, boxId: id },
    });
  }

  async onRemove(goodsId) {
    await this.removeGoods(goodsId);
    this.getBoxes();
  }

  async getTemplates(){
    this.templates = await templateService.getTemplatePage();
  }

  async removeGoods(goodsId) {
    await axios.delete(`api/admin/salesmachineaislegoods/${goodsId}`);
  }

  refreshData() {
    this.getBoxes();
  }

  async getBoxes() {
    const equipment = await fetchEquipment(this.equipmentId);
    this.boxes = equipment.aisleDetails;
  }
  // 弹出模板选择
  async goTemplate() {
    if (this.templates.length === 0){
      toast({ txt: "未添加过模板信息" });
      return;
    }
    (this.$refs.templateSelector as Popup).show();
  }
  // 选中模板
  async onSelectTemplate(id) {
    await templateService.machineSetTemplate({id, machineId: this.equipmentId});
     (this.$refs.templateSelector as Popup).hide();
    this.refreshData();
  }
}
</script>
<style lang="stylus" scoped>
.list + .list
  margin-top 8px

.template-content
  width 100%
  background-color #fff
.template-item
  text-align left
  border-bottom 1px solid #ccc
  line-height 28px
.item-content
  margin-left 10px
  font-size 14px
</style>


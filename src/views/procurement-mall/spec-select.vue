<template>
  <div class="product-detail">
    <div class="product-table">
      <table class="product-spec-table">
        <thead>
          <tr class="product-table-tr">
            <td>{{ data[0].speName1 }}</td>
            <td v-if="data[0].speName2">{{ data[0].speName2 }}</td>
            <td>零售价</td>
            <td>采购价</td>
            <td>库存</td>
            <td>采购数量</td>
          </tr>
        </thead>
        <tbody v-for="(item, index) in data" :key="index">
          <tr class="product-table-tr">
            <td>{{ item.speId1 }}</td>
            <td v-if="item.speName2">{{ item.speId2 }}</td>
            <td>{{ item.salePrice }}</td>
            <td>{{ item.tradePrice }}</td>
            <td>{{ item.inventoryNum }}</td>
            <td style="width: 20%">
              <cube-input
                style="width: 7em;"
                type="number"
                :value="selected[item.id]"
                @change="onChange(item, $event)"
              >
                <div
                  slot="prepend"
                  class="input-button"
                  @click="onSubtract(item)"
                >
                  <i class="cubeic-remove"></i>
                </div>
                <div slot="append" class="input-button" @click="onPlus(item)">
                  <i class="cubeic-add"></i>
                </div>
              </cube-input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="action-button">
      <cube-button
        style="background-color: #fff;"
        :outline="true"
        @click="onCancel()"
      >
        取消
      </cube-button>
      <cube-button
        style="background-color: #ff9600;color: #fff;"
        :outline="true"
        @click="onConfirm()"
      >
        确认
      </cube-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CubePage from '@/components/cube-page.vue';
import { toast } from '../../utils';
import { debounce } from 'rxjs/operators';

@Component({
  components: {
    CubePage,
  },
})
export default class SpecSelect extends Vue {
  @Prop()
  data;

  @Prop()
  selected;

  onSubtract(item) {
    this.$emit('subtract', item);
  }

  onPlus(item) {
    this.$emit('plus', item);
  }

  onChange(item, e) {
    this.$emit('change', { spec: item, value: e.target.valueAsNumber, spePriceKey: item.spePriceKey});
    if (item.inventoryNum < e.target.valueAsNumber){
      this.selected[item.id] = 1;
      this.$emit('change', { spec: item, value: 1, spePriceKey: item.spePriceKey});
      toast({txt: '购买数量不能大于库存数量', type: 'error', time: 2000});
      return;
    }
  }

  onConfirm() {
    this.$emit('confirm');
  }

  onCancel() {
    this.$emit('cancel');
  }
}
</script>

<style lang="stylus">
.product-detail
  background-color white

.product-table
  padding-top 6px
  padding-bottom 56px

.product-spec-table
  border-collapse collapse
  border-spacing 0
  border 1px solid #2c3e50
  width 100%

  thead
    font-size 14px

  tbody
    font-size 12px

  tr
    border 1px solid #2c3e50
    height 36px

  td
    border 1px solid #2c3e50
    text-align center
    line-height 36px
    width 15%

.action-button
  display flex
  position absolute
  bottom 0
  left 0
  width 100%
  width 100%

  button
    width 50%
    font-size 14px

.cube-input
  height 34px

.cube-input-field
  padding 4px
  height 34px

.input-button
  color #fc9153
  font-size 24px

.cube-btn-outline::after
  border: 0px;
  border-radius: 0px;

.cube-btn
  border-radius: 0px;
</style>


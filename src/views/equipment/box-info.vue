<template>
  <div class="list mdc-elevation--z2">
    <div class="title">
      <div>货道{{ box.code }}</div>
      <div>状态：{{ box.status | boxstatus }}</div>
    </div>
    <cube-swipe>
      <cube-swipe-item
        v-for="(goods, index) in stock"
        :key="index"
        class="goods-item"
        ref="swipeItem"
        :btns="btns"
        :index="index"
        @btn-click="onBtnClick(goods.id, ...arguments)"
      >
        <goods-info :key="goods.id" :goods="goods"></goods-info>
      </cube-swipe-item>
    </cube-swipe>
    <div class="actions">
      <cube-button style="margin-right: 10px;" :inline="true" @click="$emit('click', box)">
        选商品
      </cube-button>
      <cube-button :inline="true" @click="goUpdateNum">
        补货
      </cube-button>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue, Prop, Provide } from 'vue-property-decorator';

import GoodsInfo from './goods-info.vue';
import { namespace } from 'vuex-class';
const Equipment = namespace('equipment');

@Component({
  components: {
    GoodsInfo,
  },
})
export default class GoodsInfoList extends Vue {
  @Prop()
  box: any;

  btns = [
    {
      action: 'remove',
      text: '删除',
      color: '#ff3a32',
    },
  ];

  @Prop()
  stock: any[];

  
  $refs: {
    swipeItem: any[];
  };

  @Equipment.Action
  getEquipments: () => Promise<void>;
  
  onBtnClick(id, btn, index) {
    if (btn.action === 'remove') {
      this.$createActionSheet({
        title: '确认要删除吗',
        active: 0,
        data: [{ content: '删除' }],
        onSelect: () => {
          this.$emit('remove', id);
        },
      }).show();
    } else {
      this.$refs.swipeItem[index].shrink();
    }
  }

  goUpdateNum() {
    this.$createDialog({
      type: 'prompt',
      title: '请填写补货数量',
      prompt: {
        value: '1',
        placeholder: '请输入'
      },
      onConfirm: (e, value) => {
        const loading = this.loading();
        this.updateBoxNum(this.box.id, value);
        this.$emit('refresh');
        loading.hide();
      }
    }).show()
  }
  private async updateBoxNum(id, num) {
    await axios.put('api/admin/salesmachineaislegoods', { id, num });
  }
  private loading() {
    return this.$createToast({
      time: 0,
      txt: '提交中',
    }).show();
  }
}
</script>

<style lang="stylus" scoped>
.list
  border-radius 2px
  background-color #fff

  .goods-item
    border-top 1px solid #ddd

.actions
  padding 8px;
  border-top 1px solid #ddd
  text-align right

.title
  display flex
  justify-content space-between
  padding 0 8px
  font-size 16px
  line-height 2.4
</style>


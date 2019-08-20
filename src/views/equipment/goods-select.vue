<template>
  <div>
    <cube-input v-model="inputValue" placeholder="请输入商品编号/名称">
      <div style="padding-right: 10%;" placeholder="请输入验证码" slot="append">
        <cube-button :inline="true" @click="back">
          返回
        </cube-button>
      </div>
    </cube-input>
    <div
      class=" list card"
      v-for="goods in goodsData"
      :key="goods.id"
      @click="onCheck(goods)"
    >
      <div class="row">
        <div>商品名称</div>
        <div>{{ goods.name }}</div>
      </div>
      <div class="row">
        <div>商品编码</div>
        <div>{{ goods.code }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import { debounce } from 'rxjs/operators';

@Component
export default class GoodsSelectComponent extends Vue {
  @Prop()
  goods: any;

  inputValue: any = '';

  onCheck(goods: any) {
    this.$emit('checkGoods', goods);
  }
  back() {
    this.$emit('back');
  }
  get goodsData() {
    if (!this.inputValue) return this.goods;
    return this.goods.filter(item => {
      return (item.name && item.name.indexOf(this.inputValue) != -1) || (item.code && item.code.indexOf(this.inputValue) != -1)
    });
  }
}
</script>

<style lang="stylus" scoped>
.list
  margin 8px
  background-color #fff

.row
  display flex
  padding 0 8px
  line-height 30px
  font-size 14px
  justify-content space-between
</style>


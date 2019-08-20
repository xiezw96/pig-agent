<template>
  <cube-page title="采购单">
    <template slot="content">
      <cube-scroll>
        <div
          class="goods-item"
          v-for="(goodsItem, index) in goods"
          :key="index"
        >
          <div @click="onRemove(goodsItem.id)" class="deleteIcon">
            <i class="cubeic-wrong"></i>
          </div>
          <span class="pic">
            <img class="avatar" :src="goodsItem.goodsAttId | b64toUrl" />
          </span>
          <div class="goods-content">
            <span class="goodsTitle">{{ goodsItem.goodsName }}</span>
            <div class="goods-content-detail">
              <span class="goodsLeft">
                {{ [goodsItem.goodsSpe1, goodsItem.goodsSpe2] | join }}
              </span>
              <!-- <span class="goodsRight">数量: {{goodsItem.num}}</span>  -->
            </div>
            <div class="goods-content-detail">
              <span class="goodsLeft">
                采购单价：{{ goodsItem.tradePrice }}
              </span>
              <span class="goodsRight">
                <cube-input placeholder="填写数量" v-model="goodsItem.num">
                  <div
                    slot="prepend"
                    class="input-button"
                    @click="onDecrease(goodsItem)"
                  >
                    <i class="cubeic-remove"></i>
                  </div>
                  <div
                    slot="append"
                    class="input-button"
                    @click="onIncrease(goodsItem)"
                  >
                    <i class="cubeic-add"></i>
                  </div>
                </cube-input>
              </span>
            </div>
          </div>
        </div>
      </cube-scroll>
      <div class="action-button">
        <cube-button primary :disabled="goods.length === 0" @click="onToPay()">
          去支付
        </cube-button>
      </div>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';
import {
  removeGoodsById,
  fetchGoodsInCart,
  changeNumById,
} from '../../services';
import { Toast } from 'cube-ui';

const Mall = namespace('mall');

@Component<PurchaseOrderComponent>({
  components: {
    CubePage,
  },
  beforeCreate() {
    this.loading = this.$createToast({
      time: 0,
      mask: true,
    });
  },
})
export default class PurchaseOrderComponent extends Vue {
  @Mall.State('goodsInCart')
  goods: any[];

  @Mall.Action
  fetchGoodsInCart: () => Promise<void>;

  loading: Toast;

  async onRemove(id) {
    this.loading.show();
    try {
      await removeGoodsById(id);
      await this.fetchGoodsInCart();
    } finally {
      this.loading.hide();
    }
  }

  onToPay() {
    this.$router.push({ name: '确认支付' });
  }

  async onDecrease(item: any) {
    await this.changeNum(item.id, item.num - 1);
    item.num--;
  }

  async onIncrease(item: any) {
    await this.changeNum(item.id, item.num + 1);
    item.num++;
  }

  async changeNum(id, num) {
    if (num === 1) return;
    this.loading.show();
    try {
      await changeNumById(id, num);
    } finally {
      this.loading.hide();
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/css/goods.styl'

.goods-content
  height 100px

.goods-item
  height 120px
  background-color #fff

  + .goods-item
    margin-top 4px

  &:last-child
    margin-bottom 48px

.goodsRight
  padding-right 2%

.goodsTitle
  width 95%

.deleteIcon
  position absolute
  margin-top -52px
  right 0px
  font-size 20px
  color #fc9153

.action-button
  display flex
  z-index 999
  position absolute
  bottom 0
  left 0
  width 100%

  button
    width 100%
    font-size 14px

.validMessage
  margin-top -51px

.cube-input-field
  height 34px

.input-button
  font-size 28px

.checkIcon
  font-size 22px
  color #fc9153
  margin-left -5px
  padding-right 5px
</style>


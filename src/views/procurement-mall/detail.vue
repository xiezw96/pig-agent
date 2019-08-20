<template>
  <cube-page title="商品详情">
    <template #content>
      <template v-if="goods">
        <cube-scroll style="height: 93%;">
          <cube-slide
            ref="slide"
            :data="carouselPic"
          >
            <cube-slide-item
              v-for="(item, index) in carouselPic"
              :key="index"
            >
              <div
                v-if="item.type < 2"
                class="image"
                :style="{
                  backgroundImage: `url(${atob(item.attId)})`,
                }"
              ></div>
            </cube-slide-item>
          </cube-slide>
          <div class="product-title">
            {{ goods.title }}
          </div>
          <div
            class="product-table"
            v-if="goods.sepPriceList.length > 0"
          >
            <div class="product-title">
              规格
            </div>
            <table class="product-spec-table">
              <thead>
                <tr class="product-table-tr">
                  <td>{{ goods.sepPriceList[0].speName1 }}</td>
                  <td v-if="goods.sepPriceList[0].speName2">{{ goods.sepPriceList[0].speName2 }}</td>
                  <td>零售价</td>
                  <td>采购价</td>
                  <td>库存</td>
                </tr>
              </thead>
              <tbody
                v-for="(item, index) in goods.sepPriceList"
                :key="index"
              >
                <tr class="product-table-tr">
                  <td>{{ item.speId1 }}</td>
                  <td v-if="item.speId2">{{ item.speId2 }}</td>
                  <td>{{ item.salePrice }}</td>
                  <td>{{ item.tradePrice }}</td>
                  <td>{{ item.inventoryNum }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="product-image">
            <div class="product-title">
              商品详情
            </div>
            <div
              v-for="(item, index) in goods.picList"
              :key="index"
            >
              <img
                v-if="item.type > 1"
                class="avatar"
                v-lazy="atob(item.attId)"
              />
            </div>
          </div>
        </cube-scroll>
      </template>

      <div class="action-button">
        <cube-button
          style="background-color: #fff;"
          :outline="true"
          @click="toPurchaseOrder"
        >
          采购单
        </cube-button>
        <cube-button
          style="background-color: #ff9600;color: #fff;"
          :outline="true"
          @click="showSelectSpec(false)"
        >
          加入采购单
        </cube-button>
        <cube-button
          style="background-color: #e4393c;color: #fff;"
          :outline="true"
          @click="showSelectSpec(true)"
        >
          立即购买
        </cube-button>
      </div>
      <cube-popup
        v-model="visible"
        type="form-popup"
        position="bottom"
        maskClosable
        ref="formPopup"
      >
        <spec-select
          v-if="goods"
          :data="goods.sepPriceList"
          :selected="selected"
          @change="onChange($event)"
          @plus="onPlus($event)"
          @subtract="onSubtract($event)"
          @confirm="onConfirm($event)"
          @cancel="onCancel($event)"
        ></spec-select>
      </cube-popup>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { assignIn } from 'lodash';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';
import { goodsService, addToCart } from '@/services';

import SpecSelect from './spec-select.vue';
import { toast } from '@/utils';

const Mall = namespace('mall');

@Component({
  components: {
    CubePage,
    SpecSelect,
  },
  async created() {
    this.goods = await goodsService.findById(this.id);
  },
})
export default class ProcurementMallDetail extends Vue {
  @Prop()
  id;

  visible = false;

  goods = null;

  selected = {};

  cart = [];

  quickly = false;

  @Mall.Action
  fetchGoodsInCart: () => Promise<void>;

  showSelectSpec(quickly) {
    this.quickly = quickly;
    this.selected = {};
    this.visible = true;
  }

  get carouselPic() {
    return this.goods.picList.filter(item => item.type < 2);
  }
  toPurchaseOrder() {
    this.$router.push({ name: 'procurementMallOrder' });
  }

  onChange({ spec, value }) {
    this.setNum(spec.id, Math.floor(value), spec.spePriceKey);
  }

  onPlus(spec) {
    const num = this.getNum(spec);
    if (spec.inventoryNum < (num + 1)){
      this.selected[spec.id] = 1;
      toast({txt: '购买数量不能大于库存数量', type: 'error', time: 2000});
      return;
    }
    this.setNum(spec.id, num + 1, spec.spePriceKey);
  }

  onSubtract(spec) {
    const num = this.getNum(spec);
    this.setNum(spec.id, Math.max(0, num - 1), spec.spePriceKey);
  }

  async onConfirm() {
    this.visible = false;
    if (this.quickly) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.$router.replace({
        name: '确认支付',
        query: { quickly: '1' },
        replace: true,
      });
    } else {
      // 添加购物车
      await addToCart(this.cart);
      await this.fetchGoodsInCart();
    }
  }

  onCancel() {
    this.visible = false;
  }

  atob(val) {
    if (val) return atob(val);
  }

  getNum(spec) {
    const num = +this.selected[spec.id];
    if (Number.isNaN(num)) return 0;
    return num;
  }

  setNum(key, value, spePriceKey) {
    let goods = this.cart.find(item => item.goodsSpeId === key);
    if (goods) {
      goods.num = value;
    } else {
      this.cart.push({
        goodsId: this.goods.id,
        goodsSpeId: key,
        num: value,
        spePriceKey,
      });
    }
    this.$set(this.selected, key, value);
  }
}
</script>

<style lang="stylus" scoped>
.product-title
  text-align left
  padding-top 6px
  padding-bottom 4px
  font-size 15px
  line-height 24px
  padding 2%
  border-bottom 1px solid #efeff4

.product-table
  padding-top 6px
  padding-bottom 48px

.product-spec-table
  border-collapse collapse
  border-spacing 0
  border 1px solid #2c3e50
  width 100%

  thead
    font-size 14px

    tr
      border 1px solid #2c3e50
      height 36px

    td
      border 1px solid #2c3e50
      text-align center
      line-height 36px
      width 16%

  tbody
    font-size 12px

    tr
      border 1px solid #2c3e50
      height 30px

    td
      border 1px solid #2c3e50
      text-align center
      line-height 30px
      width 16%

.product-image
  padding-bottom 45px

.action-button
  position fixed
  bottom 0
  left 0
  width 100%
  z-index 99

  button
    width 33.3%
    font-size 14px

.avatar
  width 100%

.image
  padding-top 60%
  background center / contain no-repeat

.cube-btn-outline::after
  border 0px
  border-radius 0px

.cube-btn
  border-radius 0px
</style>


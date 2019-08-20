<template>
  <cube-page title="确认支付">
    <template slot="content">
      <div class="address-content">
        <div class="insert-address" v-if="!hasAddress" @click="onAddAddress()">
          <span class="tips">请增加收货地址</span>
          <i class="cubeic-add"></i>
        </div>
        <div
          class="shopping-address"
          v-if="hasAddress"
          @click="onShowAddress()"
        >
          <div class="content">
            <div class="person">
              <span class="name">收货人: {{ selectedAddress.name }}</span>
              <span class="phone">电话: {{ selectedAddress.phone }}</span>
            </div>
            <div class="address">
              {{
                [
                  selectedAddress.privince,
                  selectedAddress.city,
                  selectedAddress.area,
                ] | address
              }}{{ selectedAddress.address }}
            </div>
          </div>
          <i class="cubeic-arrow"></i>
        </div>
      </div>
      <div class="view-wrapper">
        <div class="indexContent">
          <div
            class="goods-item"
            v-for="(selected, index) in cart"
            :key="index"
          >
            <span class="pic">
              <img class="avatar" v-lazy="getImage(selected.goodsAttId)" />
            </span>
            <div class="goods-content">
              <span class="goodsTitle">
                {{ getGoods(selected.goodsId).name }}
              </span>
              <div class="goods-content-detail">
                <span class="goodsLeft">
                  {{ [selected.goodsSpe1, selected.goodsSpe2] | spec }}
                </span>
              </div>
              <div class="goods-content-detail">
                <span class="goodsLeft">
                  采购价：
                  {{ selected.tradePrice }}
                </span>
                <span class="goodsRight">数量: {{ selected.num }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="price-content">
          物流价格：<font color="#ea2b2b" size="4">{{ logisticsPrice }}</font>
        </div>
        <div>
          <cube-textarea
            v-model="message"
            :maxlength="140"
            :autoExpand="false"
            autofocus
            placeholder="请输入您的留言"
          ></cube-textarea>
        </div>
        <div class="price-content">
          共 {{ getCount() }} 件商品 总价：
          <font color="#ea2b2b" size="4">
            {{ getAmount() }}
          </font>
        </div>
      </div>
      <div class="pay-button">
        <cube-button
          style="background-color: #fc9153;color: #fff;"
          :outline="true"
          @click="onPay()"
        >
          立即支付（￥{{ getAmount() }}）
        </cube-button>
      </div>
      <cube-popup
        type="form-popup"
        ref="addressForm"
        maskClosable
        position="bottom"
      >
        <cube-form
          ref="form"
          :model="model"
          :immediate-validate="false"
          @validate="onValidate($event)"
          @submit.prevent="onSubmit()"
        >
          <cube-form-group>
            <cube-form-item :field="fields.name"></cube-form-item>
            <cube-form-item :field="fields.phone"></cube-form-item>
            <cube-form-item :field="fields.address1"></cube-form-item>
            <cube-form-item :field="fields.address2"></cube-form-item>
          </cube-form-group>
          <cube-form-group>
            <cube-button type="submit">确认</cube-button>
          </cube-form-group>
        </cube-form>
      </cube-popup>
      <cube-popup ref="addressSelector" maskClosable position="bottom">
        <div class="address-content">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="shopping-address"
            @click="onSelectAddress(address.id)"
          >
            <div class="content">
              <div class="person">
                <span class="name">收货人: {{ address.name }}</span>
                <span class="phone">电话: {{ address.phone }}</span>
              </div>
              <div class="address">
                {{ [address.privince, address.city, address.area] | address
                }}{{ address.address }}
              </div>
            </div>
          </div>
        </div>
      </cube-popup>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { Popup } from 'cube-ui';
import { find, cloneDeep } from 'lodash';
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';
import AddressPicker from '@/components/address-picker.vue';
import { AddressAddForm, WxPay } from '@/mixins';
import { concatSpecName, toFormGroup, toast } from '@/utils';
import {
  addressService,
  quicklyPay,
  pay,
  unifiedorder,
  removeOrder,
  getLogisticsFeeByCart,
  getLogisticsFeeByGoods,
} from '@/services';

import wx from 'weixin-js-sdk';

const Mall = namespace('mall');
const User = namespace('workspace/user');

@Component<CheckPay>({
  components: {
    CubePage,
  },
  created() {
    this.findAddresses();
    if (this.quickly) {
      const cartString = localStorage.getItem('cart');
      if (!cartString) {
        this.$router.back();
        return;
      }
      const cart = JSON.parse(cartString);
      this.localCart = cart
        .map(addedItem => {
          const goods = this.goods.find(
            goodsItem => goodsItem.id === addedItem.goodsId,
          );
          if (!goods) return null;
          const spec = goods.sepPriceList.find(
            specItem => specItem.id === addedItem.goodsSpeId,
          );
          return {
            goodsId: goods.id,
            goodsAttId: goods.attId,
            goodsName: goods.name,
            goodsSpe1: spec.speId1,
            goodsSpe2: spec.speId2,
            goodsSpeId: spec.id,
            logisticsPrice: spec.logisticsFees,
            num: addedItem.num,
            salePrice: spec.salePrice,
            tradePrice: spec.tradePrice,
          };
        })
        .filter(item => !!item);
    }
  },
})
export default class CheckPay extends Mixins(WxPay, AddressAddForm) {
  @Prop()
  quickly: boolean;

  @Mall.State('goodsInCart')
  remoteCart: any[];

  @Mall.State
  goods: any[];

  localCart: any[] = [];

  message = '';

  orderNo = '';

  addresses = null;

  selectedAddressId = null;

  logisticsPrice = 0;

  model = {
    name: '',
    phone: '',
    address1: [],
    address2: '',
  };


  get cart() {
    if (this.quickly) {
      return this.localCart;
    }

    return this.remoteCart;
  }

  get selectedAddress() {
    if (!this.addresses) return;
    if (!this.selectedAddressId) return;
    const address = this.addresses.find(
      address => address.id === this.selectedAddressId,
    );
    return address;
  }

  async onSubmit(e) {
    const {
      address1: [privince, city, area],
      address2: address,
      ...rest
    } = this.model;
    const dto = {
      privince,
      city,
      area,
      address,
      isDefault: 1,
      ...rest,
    };

    await addressService.create(dto);

    (this.$refs.addressForm as Popup).hide();
    this.findAddresses();
  }
  
  async findAddresses() {
    this.addresses = await addressService.find();
    const address = this.addresses.find(address => address.isDefault);
    if (address) {
      this.selectedAddressId = address.id;
    }
    this.getLogisticsPrice();
  }

  async onPay() {
    if (!this.hasAddress){
      toast({ txt: '请填写收货地址', type: 'error', time: 2000 });
      return;
    }
    let orderData = undefined;

    if (this.quickly) {
      if (this.selectedAddressId === null) return;
      orderData = await quicklyPay({
        addressId: this.selectedAddressId,
        goods: this.cart,
        message: this.message,
      });
      // 下单完成后需要手动清除本地购物车
      localStorage.removeItem('cart');
    } else {
      orderData = await pay({
        addressId: this.selectedAddressId,
        message: this.message,
      });
    }
    if (!orderData.data) {
      toast({ txt: '创建订单未成功,请稍后再试', type: 'error', time: 2000 });
      return;
    }
    try {
      this.orderNo = orderData.data;
      try {
        const data = await this.unifiedorder(this.orderNo);
        const result: any = await this.wxPay(data);
        if (result.errMsg === 'chooseWXPay:ok') {
          this.$router.push({ name: 'procurementMallRecord', params: {form: 'pay'} });
        }
      } catch (error) {
        this.$router.push({ name: 'procurementMallRecord', params: {form: 'pay'} });
      }
    } catch (error) {
      toast({ txt: error.message, type: 'error', time: 2000 });
      setTimeout(() => {
        wx.closeWindow();
      }, 2000);
    }
  }


  getGoods(id) {
    const goods = this.goods.find(item => item.id === id);
    if (!goods) return {};
    return goods;
  }

  getImage(attId) {
    if (!attId) return '';
    return atob(attId);
  }

  getSpec(id, goods) {
    const specs = goods.sepPriceList || ([] as any[]);
    const spec = specs.find(item => item.id === id);
    if (!spec) return {};
    return spec;
  }

  getSpecName(spec) {
    if (!spec) return '';
    return concatSpecName([spec.speId1, spec.speId2]);
  }

  async getLogisticsPrice() {
    let fee = 0;
    if (this.quickly) {
      // 立即购买
      fee = await getLogisticsFeeByGoods({
        addressId: this.selectedAddressId,
        goods: this.cart,
      });
    } else {
      // 购物车
      fee = await getLogisticsFeeByCart({
        addressId: this.selectedAddressId,
      });
    }
    this.logisticsPrice = fee;
  }

  getAmount() {
    let total = this.cart.reduce((total, item) => {
      const num = item.num;
      const tradePrice = (item.tradePrice || 0) * num;
      total += tradePrice;
      return total;
    }, 0);
    return total + this.logisticsPrice;
  }

  getCount() {
    return this.cart.reduce((total, item) => {
      const num = item.num;
      total += num;
      return total;
    }, 0);
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/css/goods.styl'
.tips
  position absolute
  padding-left -14%
  left 0
  padding-left 31%

.address-content
  width 100%
  background-color #fff

.insert-address
  height 86px
  line-height 86px

.cubeic-add
  font-size 24px
  padding-left 32%

.shopping-address
  display flex
  height 96px
  align-items center

  + .shopping-address
    border-top 1px solid #ccc

  .content
    flex 1 1 1px
    align-self flex-start

  .icon
    flex 0 0 40px

.person
  line-height 32px
  width 100%
  display flex

.name
  width 42%
  left 0px
  text-align left
  padding-left 15px

.phone
  width 58%
  text-align right
  padding-right 15px

.address
  text-align left
  padding 0 15px
  line-height 20px
  display -webkit-box
  -webkit-box-orient vertical
  -webkit-line-clamp 2
  overflow hidden

.indexContent
  border-bottom 1px solid #efeff4

  ul
    font-size 13px

    li
      width 100%
      line-height 26px
      border-top 1px solid #efeff4
      display flex

      .left
        padding-left 4%

.view-wrapper
  position relative
  top 8px
  left 0
  bottom 0
  width 100%
  padding-bottom 50px
  background-color #fff

.pay-button
  position fixed
  bottom 0
  left 0
  width 100%
  width 100%

  button
    width 100%
    font-size 14px

.price-content
  text-align right
  font-size 14px
  padding 3%

.address-button
  padding-left 0
  padding-right 0
  text-align left
  color inherit
  background none !important
  border none
</style>
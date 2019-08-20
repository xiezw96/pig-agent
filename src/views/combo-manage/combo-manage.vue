<template>
  <cube-page title="激活套餐">
    <template #content>
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
      <cube-select
        v-model="selectedKey"
        title="激活套餐"
        style="margin-top: 10px;"
        :options="options"
        placeholder="请选择激活套餐"
        @change="changeCombo"
      >
      </cube-select>
      <h2 class="title">套餐内容</h2>
      <app-self-buying
        v-if="comboType === 0"
        :combo="selectedCombo"
        :total="total"
      ></app-self-buying>
      <app-goods v-else-if="comboType === 1" :combo="selectedCombo"></app-goods>
      <app-money v-else-if="comboType === 2" :combo="selectedCombo"></app-money>

      <div class="bottom-button">
        <cube-button :disabled="comboType === undefined" @click="onPay()">
          支付 {{ amount === undefined ? '' : `(${amount.toFixed(2)})` }}
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
          @submit.prevent="onSubmitAddress()"
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
import { Component, Vue, Mixins } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
import CubePage from '@/components/cube-page.vue';
import { comboService, agentService, addressService } from '@/services';
import { store } from '@/store';

import { Popup } from 'cube-ui';
import Goods from './goods.vue';
import Money from './money.vue';
import SelfBuying from './self-buying.vue';
import { AddressAddForm, WxPay } from '@/mixins';
import { toast } from '@/utils';
const User = namespace('workspace/user');

@Component<ComboManage>({
  components: {
    CubePage,
    AppGoods: Goods,
    AppMoney: Money,
    AppSelfBuying: SelfBuying,
  },
  beforeRouteEnter(_to, _from, next) {
    const { agentInfo } = store.state.workspace.user;

    // 未认证时，重定向到认证信息页面
    if (agentInfo.auditStatus !== 1) {
      next({ name: '认证信息' });
      return;
    }

    // 已激活时，重定向到首页
    if (agentInfo.activeStatus === 1) {
      next({ name: '首页' });
      return;
    }

    next();
  },
  created() {
    this.getCombo();
    this.findAddresses();
  },
})
export default class ComboManage extends Mixins(WxPay, AddressAddForm) {
  /**
   * 所选套餐ID
   */
  selectedKey = null;

  @User.State
  openId: string;

  /**
   * 所有可选套餐
   */
  combos: any[] = [];

  total: any = 0;

  /**
   * 套餐选项
   */
  get options() {
    return this.combos.map(option => ({
      value: option.id,
      text: option.name,
    }));
  }

  /**
   * 所选套餐
   */
  get selectedCombo() {
    return this.combos.find(combo => combo.id === this.selectedKey);
  }

  async changeCombo() {
    if (!this.hasAddress){
      toast({ txt: '请填写收货地址', type: 'error', time: 2000 });
      return;
    }
    this.getTotalPrice();
  }

  /**
   * 所选套餐类型
   */
  get comboType() {
    if (!this.selectedCombo) return;
    return this.selectedCombo.type;
  }

  async getTotalPrice() {
    if (!this.selectedKey || !this.selectedAddressId)
      return;
    this.total =  await comboService.getComboTotalMoney({
      comboId: this.selectedKey,
      addressId: this.selectedAddressId,
    });
  }
  
  /**
   * 支付金额
   */
  get amount() {
    return this.total;
  }

  /**
   * 发起支付
   */
  async onPay() {
    
    const tradeNo = await comboService.selectcombo({
      comboId: this.selectedKey,
      addressId: this.selectedAddressId,
    });
    if (!tradeNo) {
      toast({ txt: '创建订单未成功,请稍后再试', type: 'error', time: 2000 });
      return;
    }
    if (!this.openId) {
      this.openId = sessionStorage.getItem('openId');
    }
    const orderResultData = await comboService.unifiedorder({
      openid: this.openId,
      tradeNo,
    });
    const data = orderResultData.data;
    try {
      const result: any = await this.wxPay(data);
      if (result.errMsg === 'chooseWXPay:ok') {
        const agent = await agentService.get();
        store.commit('workspace/user/setAgentInfo', agent);
        this.$router.push({ name: '首页' });
      }
    } catch (error) {}
  }

  /**
   * 获取激活套餐
   */
  async getCombo() {
    this.combos = await comboService.find();
  }

  async onSubmitAddress(e) {
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
    this.getTotalPrice();
  }
}
</script>

<style lang="stylus" scoped>
.title
  margin-top 16px
  line-height 2
  font-size 20px
  font-weight bold
  text-align left

.bottom-button
  position absolute
  bottom 0
  left 0
  box-sizing border-box
  width 100%
  padding 10px

  .address-content
    width 100%
    background-color #fff

.address-content
  width 100%
  background-color #fff

.insert-address
  height 86px
  line-height 86px

.cubeic-add
  font-size 24px
  color: #fc9255;

.shopping-address
  display flex
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
</style>


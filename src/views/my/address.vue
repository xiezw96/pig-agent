<template>
  <cube-page title="配送地址">
    <template #rightExtAction>
      <i @click="onClick" class="cubeic-add"></i>
    </template>
    <template slot="content">
      <div class="indexList">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          data-pos="right"
          :class="item.isDefault === 1 ? checked : unCheck"
          @click="checkItem(item)"
        >
          <label class="cube-checkbox-wrap">
            <input type="checkbox" class="cube-checkbox-input" />
            <span class="cube-checkbox-ui cubeic-round-border">
              <i class="cubeic-right"></i
            ></span>
            <span class="cube-checkbox-label">
              <p>姓名：{{ item.name }} 电话：{{ item.phone }}</p>
              <p>{{ item.allAddress }}</p>
            </span>
          </label>
        </div>
      </div>
      <cube-popup
        type="form-popup"
        ref="formPopup"
        maskClosable
        position="bottom"
      >
        <cube-form
          ref="addressForm"
          :model="model"
          @validate="validateHandler"
          @submit="submitHandler"
        >
          <cube-form-group>
            <cube-form-item :field="fields[0]"></cube-form-item>
            <cube-form-item :field="fields[1]"></cube-form-item>
            <cube-form-item :field="fields[2]">
              <address-picker
                ref="addressPicker"
                @change="addressChange"
              ></address-picker>
            </cube-form-item>
            <cube-form-item :field="fields[3]"></cube-form-item>
            <cube-form-item :field="fields[4]"></cube-form-item>
          </cube-form-group>
          <cube-form-group>
            <cube-button type="submit">提交</cube-button>
          </cube-form-group>
        </cube-form>
      </cube-popup>
    </template>
  </cube-page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { namespace } from 'vuex-class';

import { AddressFormConfig } from '@/mixins';
import CubePage from '@/components/cube-page.vue';
import AddressPicker from '@/components/address-picker.vue';

const Address = namespace('personal/address');

import { addressService } from '@/services';

import { provinceList, cityList, areaList } from '@/constants/areas';
const asyncProvinceList = provinceList.slice();
const asyncCityList = JSON.parse(JSON.stringify(cityList));
const asyncAreaList = JSON.parse(JSON.stringify(areaList));

@Component<ShoppingAddressComp>({
  name: 'shopping-address',
  mixins: [AddressFormConfig],
  components: {
    'cube-page': CubePage,
    'address-picker': AddressPicker,
  },
  created() {
    this.finAllAddress();
  },
})
export default class ShoppingAddressComp extends Vue {
  validity: any = {};
  valid: any = undefined;
  dataList: any[] = [];
  checked: string = 'cube-checkbox cube-checkbox_checked';
  unCheck: string = 'cube-checkbox';
  asyncProvinceList: any[] = asyncProvinceList;
  async finAllAddress() {
    const result = await addressService.find();
    const dataList = result.map((item: any) => {
      const province = provinceList.find(i => i.value === item.privince);
      const city = (province as any).children.find(i => i.value === item.city);
      const area = (city as any).children.find(i => i.value === item.area);
      const address = province.text + city.text + area.text;
      item.allAddress = address + item.address;
      return item;
    });
    this.dataList = dataList;
  }
  checkItem(item: any) {
    const _that = this as any;
    _that.model = item;
    const province = asyncProvinceList.find(i => i.value === item.privince);
    const city = (province as any).children.find(i => i.value === item.city);
    const area = (city as any).children.find(i => i.value === item.area);
    _that.model.selectedText = province.text + city.text + area.text;
    _that.model.addressValue = [province, city, area];
    const temp = ' ';
    _that.$refs.addressPicker.value =
      province.text + temp + city.text + temp + area.text;
    (this as any).$refs.formPopup.show();
  }
  hide(this: any) {
    this.$refs.formPopup.hide();
  }
  async submitHandler(e: any) {
    const _that = this as any;
    e.preventDefault();
    if (!_that.valid) return;
    this.hide();
    let data: any = this.dataList.find(item => item.isDefault === 1);
    if (data) {
      data.isDefault = 0;
    }
    if (_that.model.isDefault === '是') {
      let cuurModel: any = this.dataList.find(
        item => item.id === _that.model.id,
      );
      if (cuurModel) {
        cuurModel.checked = true;
      }
      _that.model.isDefault = '1';
    } else {
      _that.model.isDefault = '0';
    }
    if (!_that.model.id) {
      await addressService.create(_that.model);
    } else {
      await addressService.update(_that.model.id, _that.model);
    }
    this.finAllAddress();
  }
  validateHandler(result: any) {
    this.validity = result.validity;
    this.valid = result.valid;
  }
  resetHandler() {
    const _that = this as any;
    _that.$refs.addressPicker.value = '';
    _that.$refs.addressForm.reset();
  }
  onClick() {
    this.resetHandler();
    (this as any).$refs.formPopup.show();
  }
}
</script>

<style lang="stylus" scoped>
.indexList
  background-color #fff

.cube-checkbox
  border-bottom 1px solid #efeff4
</style>

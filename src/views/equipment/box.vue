<template>
  <cube-page title="补货">
    <template #content>
      <goods-select @checkGoods="checkGoods" @back="closeSelect" :goods="goods" v-show="selectGoodsShow">
      </goods-select>
      <cube-form
        style="text-align: left;"
        ref="from"
        :model="model"
        :schema="formGroup"
        @validate="bindSubmitHandler"
        @submit.prevent="onSubmit"
        v-show="!selectGoodsShow"
      ></cube-form>
    </template>
  </cube-page>
</template>

<script lang="ts">
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { goodsService } from '@/services';
import { concatSpecName } from '@/utils';
import { debounce } from 'rxjs/operators';

import GoodsSelect from './goods-select.vue';
import { Popup } from 'cube-ui';

const Equipment = namespace('equipment');

@Component({
  components: {
    GoodsSelect,
  },
  async created() {
    this.goods = await goodsService.find();
  },
})
export default class BoxComponent extends Vue {
  @Prop()
  boxId: string;

  selectGoodsShow: boolean = false;

  goods = [];

  valid= undefined;

  addedGoods = [];
  specs = [];
  model = {
    goodsId: undefined,
    goodsName: '',
    goodsSpeId: undefined,
    num: 1,
    spePriceKey: undefined,
  };
  get goodsNames() {
    return this.goods.map(goods => ({
      text: `${goods.name}/${goods.code}`,
      value: goods.id,
    }));
  }
  get formGroup() {
    const formGroup = {
      fields: [
        {
          label: '商品名称',
          modelKey: 'goodsName',
          type: 'input',
          props: {
            placeholder: '选择商品',
            readonly: true,
          },
          rules: {
            required: true,
          },
          events: {
            focus: this.doSelectGoods,
          },
        },
        {
          label: '规格',
          modelKey: 'goodsSpeId',
          type: 'select',
          props: {
            options: this.specs,
          },
          rules: {
            required: true,
          },
          events: {
            input: value => this.onChange('goodsSpeId', value),
          },
        },
        {
          label: '数量',
          modelKey: 'num',
          type: 'input',
          props: {
            type: 'number',
            min: 1,
          },
          rules: {
            required: true,
          },
        },
        {
          label: '提交',
          type: 'submit',
        }
      ],
    }
    return formGroup;
  }


  @Equipment.Action
  getEquipments: () => Promise<void>;

  onChange(fieldName, value) {
    if (fieldName === 'goodsSpeId') {
      const targetGoods = this.goods.find(item => item.id === this.model.goodsId);
      const spec = targetGoods.sepPriceList.find(spec => spec.id === value);
      this.model.spePriceKey = spec.spePriceKey;
    }
  }
  
  doSelectGoods(this: any) {
    this.selectGoodsShow = true;
  }

  closeSelect() {
    this.selectGoodsShow = false;
  }

  checkGoods(goods) {
    this.selectGoodsShow = false;
    this.model.goodsId = goods.id;
    this.model.goodsName = goods.name;
    this.specs = goods.sepPriceList.map(spec => ({
      text: concatSpecName([spec.speId1, spec.speId2]),
      value: spec.id,
    }));
  }

  async onSubmit() {
    const loading = this.loading();
    try {
      this.addedGoods.push(this.model);
      await this.replenish(this.boxId, this.addedGoods);

      this.getEquipments();
      setTimeout(() => {
        this.toast();
      }, 20);

      this.$router.back();
    } finally {
      loading.hide();
    }
  }

  bindSubmitHandler(e: any) {
    if (!this.valid) return;
  }

  private async replenish(id, goods) {
    await axios.post('api/admin/salesmachineaislegoods', { goods, id });
  }

  private loading() {
    return this.$createToast({
      time: 0,
      txt: '提交中',
    }).show();
  }

  private toast() {
    this.$createToast({
      type: 'text',
      time: 2000,
      txt: '补货完成',
    });
  }
}
</script>


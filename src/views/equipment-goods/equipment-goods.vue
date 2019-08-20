<template>
  <cube-page title="柜子商品">
    <template #rightExtAction>
      <i @click="onShowSearchFormPopup()" class="cubeic-search"></i>
    </template>
    <template slot="content">
      <cube-scroll style="height: 100%;">
        <goods-info
          v-for="item in list"
          :key="item.id"
          :goods="item"
        ></goods-info>
      </cube-scroll>
      <cube-popup
        ref="searchFormPopup"
        type="search-form-popup"
        position="bottom"
        maskClosable
      >
        <cube-form
          ref="searchForm"
          :model="searchFormValues"
          :schema="searchFormGroup"
          @submit.prevent="onSearch()"
        >
        </cube-form>
      </cube-popup>
    </template>
  </cube-page>
</template>

<script lang="ts">
import axios from 'axios';
import { Popup, Form } from 'cube-ui';
import { Component, Vue } from 'vue-property-decorator';

import { PAGINATION } from '@/constants';

import GoodsInfo from './goods-info.vue';

@Component<EquipmentGoodsComponent>({
  components: {
    GoodsInfo,
  },
  async created() {
    this.list = await this.getGoods();
  },
})
export default class EquipmentGoodsComponent extends Vue {
  list: any[] = [];

  searchFormValues = {
    machineName: '',
    goodsName: '',
    aisleCode: '',
  };

  searchFormGroup = {
    fields: [
      {
        type: 'input',
        modelKey: 'goodsName',
        label: '商品编码/名称',
        props: {
          placeholder: '请输入商品编码/名称',
        },
        rules: {
          max: 50,
        },
      },
      {
        type: 'input',
        modelKey: 'machineName',
        label: '柜子编码/名称',
        props: {
          placeholder: '请输入柜子编码/名称',
        },
        rules: {
          max: 50,
        },
      },
      {
        type: 'input',
        modelKey: 'aisleCode',
        label: '货道编码',
        props: {
          placeholder: '请输入货道编码',
          type: 'number',
        },
        rules: {
          type: 'number',
          min: 1,
          max: 999,
        },
      },
      {
        label: '查询',
        type: 'submit',
      },
    ],
  };

  $refs: {
    searchFormPopup: Popup;
    searchForm: Form;
  };

  onShowSearchFormPopup() {
    this.$refs.searchFormPopup.show();
  }

  async onSearch(e: any) {
    const valid = await (this.$refs.searchForm as any).validate();

    if (!valid) return;

    const loading = this.loading();

    try {
      this.list = await this.getGoods(this.searchFormValues);
      this.$refs.searchFormPopup.hide();
    } finally {
      loading.hide();
    }
  }

  private async getGoods(dto?) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/salesmachineaislegoods/page', {
      params: { ...PAGINATION, ...dto },
    });

    return records;
  }

  private loading() {
    return this.$createToast({
      time: 0,
      txt: '加载中',
    }).show();
  }
}
</script>

<style lang="stylus" scoped>
.data-item
  display flex
  height 25px
  align-items center
  font-size 13px
  padding 2px 0 0 10px
  // background-color: #e0dede

.left
  text-align left
  width 50%

.right
  width 50%
  text-align right
  padding-right 3%

.indexContent
  border-bottom 1px solid #efeff4

  ul
    font-size 13px

    li
      width 100%
      line-height 30px
      border-top 1px solid #efeff4
      display flex

      .left
        padding-left 4%

      .address
        width 100%
        text-align left
        padding-left 4%

.view-wrapper
  .index-list-wrapper
    height 98%
    width 94%
    margin 0 auto
    overflow hidden

    &.custom
      .cube-index-list-content
        // background-color: #222
        // color: #909090

      .cube-index-list-group
        padding-bottom 0px

.goods-item
  display flex
  height 80px
  align-items center
  font-size 12px
  padding 2px 0 0 10px

.pic
  text-align left
  width 30%

  .avatar
    width 100%
    height 74px
    margin-bottom 12px

.goods-content
  width 70%
  height 90px
  text-align left
  padding-left 4%

  .goodsTitle
    font-size 14px
    line-height 18px

  .goods-content-detail
    width 100%
    display flex
    line-height 18px
    padding-top 3px

    .goodsLeft
      width 50%
      text-align left
      padding-left 4%

    .goodsRight
      width 50%
      text-align right
      padding-right 4%
</style>

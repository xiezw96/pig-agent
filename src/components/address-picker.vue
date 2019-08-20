<template>
  <div>
    <cube-input ref="address" v-model="value" readonly @focus="onFoucus"></cube-input>
  </div>
</template>

<script>
  import { provinceList, cityList, areaList } from '@/constants/areas'
  const asyncProvinceList = provinceList.slice()
  const asyncCityList = JSON.parse(JSON.stringify(cityList))
  const asyncAreaList = JSON.parse(JSON.stringify(areaList))
  const addressData = provinceList
  addressData.forEach(province => {
    province.children = cityList[province.value]
    province.children.forEach(city => {
      city.children = areaList[city.value]
    })
  })
  export default {
    data() {
      return {
        value: '',
      }
    },
    props: {
      text: ''
    },
    model: {
      event: 'change'
    },
    mounted() {
      this.addressPicker = this.$createCascadePicker({
        title: '请选择地址',
        data: addressData,
        onSelect: this.selectHandle,
        onCancel: this.cancelHandle
      });
    },
    methods: {
      onFoucus() {
        this.addressPicker.show()
      },
      selectHandle(selectedVal, selectedIndex, selectedText) {
        this.value = selectedText.join(' ');
        this.$emit('change', selectedVal, selectedIndex, selectedText);
      },
      cancelHandle() {
      }
    },
    components: {
    }
  }
</script>

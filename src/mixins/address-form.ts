import AddressPicker from '@/components/address-picker.vue';

import Vue from 'vue';

export default Vue.extend({
  components: {
    AddressPicker,
  },
  data() {
    return {
      model: {
        id: '',
        name: '',
        phone: '',
        privince: '',
        city: '',
        area: '',
        address: '',
        isDefault: '0',
        addressValue: [],
        selectedText: '',
      },
      fields: [
        {
          type: 'input',
          modelKey: 'name',
          label: '姓名',
          props: {
            placeholder: '请输入姓名',
          },
          rules: {
            required: true,
            max: 50,
          },
          trigger: 'blur',
        },
        {
          type: 'input',
          modelKey: 'phone',
          label: '电话',
          rules: {
            type: 'tel',
            required: true,
          },
          trigger: 'blur',
        },
        {
          component: AddressPicker,
          modelKey: 'selectedText',
          label: '地址',
          events: {
            change: (this as any).addressChange,
          },
          props: {
            placeholder: '请输入选择地址',
          },
          rules: {
            required: true,
          },
          // trigger: 'blur',
        },
        {
          type: 'input',
          modelKey: 'address',
          label: '详细地址',
          props: {
            type: 'address',
            placeholder: '请输入详细地址',
            required: true,
          },
          rules: {
            max: 100,
          },
          trigger: 'blur',
        },
        {
          type: 'checkbox',
          modelKey: 'isDefault',
          label: '默认地址',
          props: {
            label: '是',
            value: true,
          },
        },
        {
          type: 'submit',
          label: '提交',
        },
      ],
    };
  },
  methods: {
    addressChange(selectedVal: any, selectedIndex: any, selectedText: any) {
      if (!selectedVal) return;
      this.addressValue = selectedVal;
      this.model.privince = selectedVal[0];
      this.model.city = selectedVal[1];
      this.model.area = selectedVal[2];
      this.model.selectedText = selectedText.join('');

    },
  },
});

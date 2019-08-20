import AddressPicker from '@/components/address-picker.vue';
import { toFormGroup } from '@/utils';
import { Popup } from 'cube-ui';
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class AddressAddtMixin extends Vue {

  addresses = null;

  selectedAddressId = null;

  validity = {};

  valid = undefined;

  model = {
    name: '',
    phone: '',
    address1: [],
    address2: '',
  };

  fields = toFormGroup([
    {
      label: '姓名',
      modelKey: 'name',
      type: 'input',
      props: {
        placeholder: '请填写收货人姓名',
      },
      rules: {
        required: true,
        max: 50,
      },
    },
    {
      label: '手机号',
      modelKey: 'phone',
      type: 'input',
      props: {
        type: 'number',
        placeholder: '请输入11位手机号',
      },
      rules: {
        type: 'tel',
        required: true,
      },
      trigger: 'blur',
    },
    {
      label: '地址',
      component: AddressPicker,
      modelKey: 'address1',
      rules: {
        required: true,
      },
    },
    {
      label: '详细地址',
      modelKey: 'address2',
      type: 'input',
      props: {
        placeholder: '请输入详细地址',
      },
      rules: {
        required: true,
        max: 60,
      },
    },
  ]);

  get hasAddress() {
    return this.selectedAddress;
  }

  get selectedAddress() {
    if (!this.addresses) return;
    if (!this.selectedAddressId) return;
    const address = this.addresses.find(
      address => address.id === this.selectedAddressId,
    );
    return address;
  }

  onValidate(result: any) {
    this.validity = result.validity;
    this.valid = result.valid;
  }

  onAddAddress(item: any) {
    (this.$refs.addressForm as Popup).show();
  }

  onShowAddress() {
    (this.$refs.addressSelector as Popup).show();
  }

  onSelectAddress(id) {
    this.selectedAddressId = id;
    (this.$refs.addressSelector as Popup).hide();
  }
}

import CubePage from '@/components/cube-page.vue';
import { currentUserService } from '@/services';
import { Component, Vue } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { namespace } from 'vuex-class';

const { mapActions } = createNamespacedHelpers('workspace/user');
const { mapMutations } = createNamespacedHelpers('workspace/user');

const User = namespace('workspace/user');

@Component({
  components: { CubePage },
})
export class PersonalCenterComponent extends Vue {
  dataList = [
    {
      label: '认证信息',
      path: 'authInfo',
    },
    {
      label: '我的密码',
      path: 'password',
    },
    {
      label: '交易密码',
      path: 'transactionPwd',
    },
    // {
    //   label: '我的手机',
    //   path: 'bindPhone',
    // },
    {
      label: '配送地址',
      path: 'address',
    },
    {
      label: '代金券',
      path: 'voucher',
    },
    {
      label: '发展抽佣',
      path: 'developCommission',
    },
  ];

  selected = '';

  checked = 'cube-checkbox cube-checkbox_checked';

  @User.Mutation
  clear;

  async onLogout(this: any) {
    await currentUserService.logout();
    this.clear();
    this.$router.push({ name: '登陆' });
  }

  checkItem(item: any) {
    this.$router.push(item.path);
  }
}

export default PersonalCenterComponent;

// export default Vue.extend({
//   name: 'personal-center',
//   components: {
//     CubePage,
//   },
//   data(this: any) {
//     return {
//       dataList: [
//         {
//           label: '认证信息',
//           path: 'authInfo',
//         },
//         {
//           label: '我的密码',
//           path: 'password',
//         },
//         {
//           label: '交易密码',
//           path: 'transactionPwd',
//         },
//         // {
//         //   label: '我的手机',
//         //   path: 'bindPhone',
//         // },
//         {
//           label: '配送地址',
//           path: 'address',
//         },
//         {
//           label: '代金券',
//           path: 'voucher',
//         },
//         {
//           label: '发展抽佣',
//           path: 'developCommission',
//         },
//       ],
//       selected: '',
//       checked: 'cube-checkbox cube-checkbox_checked',
//     };
//   },
//   methods: {
//     ...mapMutations(['clear']),
//     checkItem(item: any) {
//       this.$router.push(item.path);
//     },
//     async onLogout(this: any) {
//       await currentUserService.logout();
//       this.clear();
//       this.$router.push({ name: '登陆' });
//     },
//   },
// });

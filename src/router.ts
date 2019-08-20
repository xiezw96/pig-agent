import Router, { RouteConfig } from 'vue-router';

import { ActivedGuard } from '@/views/actived.guard';
import { EquipmentResoler as EquipmentResolver } from '@/views/equipment/equipment.resolver';
import { CartGuard } from '@/views/procurement-mall/cart.guard';
import { MallGuard } from '@/views/procurement-mall/mall.guard';
import { ProtectedGuard } from '@/views/protected.guard';

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'root',
    redirect: { name: '首页' },
  },
  {
    path: '/login',
    name: '登陆',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/auth',
    name: '微信认证',
    component: () => import('@/views/wx-auth.vue'),
  },
  {
    path: '/userPay',
    name: '用户下单支付',
    component: () => import('@/views/user-pay.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register.vue'),
  },
  {
    path: '/resetPwd',
    name: 'resetPwd',
    component: () => import('@/views/reset-pwd.vue'),
  },
  {
    path: '',
    component: ProtectedGuard,
    children: [
      {
        path: '/authInfo',
        name: '认证信息',
        component: () => import('@/views/my/auth-info.vue'),
      },
      {
        path: '/comboManage',
        name: '激活套餐',
        component: () => import('@/views/combo-manage/combo-manage.vue'),
      },
      {
        path: '',
        component: ActivedGuard,
        children: [
          {
            path: '/home',
            name: '首页',
            component: () => import('@/views/home.vue'),
          },
          {
            path: '',
            component: MallGuard,
            children: [
              {
                path: '/procurementMall',
                name: 'procurementMall',
                component: () =>
                  import('@/views/procurement-mall/procurement-mall.vue'),
              },
              {
                path: '/procurementMallSearch',
                name: 'procurementMallSearch',
                component: () => import('@/views/procurement-mall/search.vue'),
              },
              {
                path: '',
                component: CartGuard,
                children: [
                  {
                    path: '/goods/:id',
                    name: 'procurementMallDetail',
                    props: true,
                    component: () =>
                      import('@/views/procurement-mall/detail.vue'),
                  },
                  {
                    path: '/procurementMallOrder',
                    name: 'procurementMallOrder',
                    component: () =>
                      import('@/views/procurement-mall/purchase-order.vue'),
                  },
                  {
                    path: '/procurementMallPay',
                    name: '确认支付',
                    props: route => ({ ...route.params, ...route.query }),
                    component: () =>
                      import('@/views/procurement-mall/check-pay.vue'),
                  },
                ],
              },
            ],
          },
          {
            path: '/procurementMallRecord',
            name: 'procurementMallRecord',
            component: () =>
              import('@/views/procurement-mall/purchase-record.vue'),
          },
          {
            path: '/settleAccount',
            name: 'settleAccount',
            component: () =>
              import('@/views/settle-account/settle-account.vue'),
          },
          {
            path: '/settleAccountDetail',
            name: 'settleAccountDetail',
            component: () => import('@/views/settle-account/detail.vue'),
          },
          {
            path: '/order',
            name: 'order',
            component: () => import('@/views/order/order.vue'),
          },
          {
            path: '/withdrawDeposit',
            name: 'withdrawDeposit',
            component: () =>
              import('@/views/withdraw-deposit/withdraw-deposit.vue'),
          },
          {
            path: '/equipmentGoods',
            name: 'equipmentGoods',
            component: () =>
              import('@/views/equipment-goods/equipment-goods.vue'),
          },
          {
            path: '/developEamrnings',
            name: 'developEamrnings',
            component: () =>
              import('@/views/develop-eamrnings/develop-eamrnings.vue'),
          },
          {
            path: '/developEamrningsDetail/:id',
            name: 'developEamrningsDetail',
            props: true,
            component: () => import('@/views/develop-eamrnings/detail.vue'),
          },
          {
            path: '/developEamrningsRecommend',
            name: 'developEamrningsRecommend',
            component: () => import('@/views/develop-eamrnings/recommend.vue'),
          },
          {
            path: '/personalCenter',
            name: 'personalCenter',
            component: () => import('@/views/my/personal-center.vue'),
          },
          {
            path: '/information',
            name: 'myInformation',
            component: () => import('@/views/my/information.vue'),
          },
          {
            path: '/noticeMessage',
            name: 'noticeMessage',
            component: () =>
              import('@/views/notice-message/notice-message.vue'),
          },
          {
            path: '/password',
            name: 'password',
            component: () => import('@/views/my/password.vue'),
          },
          {
            path: '/transactionPwd',
            name: 'transactionPwd',
            component: () => import('@/views/my/transaction-pwd.vue'),
          },
          {
            path: '/bindPhone',
            name: 'bindPhone',
            component: () => import('@/views/my/bind-phone.vue'),
          },
          {
            path: '/address',
            name: 'address',
            component: () => import('@/views/my/address.vue'),
          },
          {
            path: '/voucher',
            name: 'voucher',
            component: () => import('@/views/my/voucher.vue'),
          },
          {
            path: '/developCommission',
            name: 'developCommission',
            component: () => import('@/views/my/develop-commission.vue'),
          },
          {
            path: '/machineTemplate',
            name: 'machineTemplate',
            component: () => import('@/views/my/machine-template.vue'),
          },
          {
            path: '/templateDetail',
            name: '模板详情',
            component: () => import('@/views/my/template-detail.vue'),
          },
          {
            path: '',
            component: EquipmentResolver,
            children: [
              {
                path: '/replenishment',
                name: 'replenishment',
                component: () => import('./views/equipment/gate.vue'),
              },
              {
                path: '/equipment',
                name: 'equipment',
                component: () => import('@/views/equipment/equipment.vue'),
              },
              {
                path: '/equipments/:equipmentId/malfunction',
                name: '故障',
                props: true,
                component: () => import('./views/equipment/malfunction.vue'),
              },
              {
                path: '/equipments/:equipmentId/boxes',
                name: '货道管理',
                props: true,
                component: () => import('./views/equipment/box-list.vue'),
              },
              {
                path: '/equipments/:equipmentId/boxes/:boxId',
                name: '开柜补货',
                props: true,
                component: () => import('./views/equipment/box.vue'),
              },
            ],
          },
        ],
      },
    ],
  },
];

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

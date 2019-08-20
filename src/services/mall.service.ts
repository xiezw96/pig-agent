import axios from 'axios';

import { PAGINATION } from '@/constants';

export async function quicklyPay(dto) {
  const { data } = await axios.post('api/admin/order/agent/bygoods', dto);
  return data;
}

export async function removeOrder(code: any) {
  await axios.delete(`api/admin/order/agent/${code}`);
}

export async function removeUserOrder(dto: any) {
  await axios.delete(`api/admin/order/user/bymachine/${dto.code}`, {
    params: {
      openid: dto.openid,
    },
    headers: {
      'X-Token-Needed': false,
    },
  });
}

export async function pay(dto) {
  const { data } = await axios.post('api/admin/order/agent', dto);
  return data;
}

/**
 * 调用微信支付统一下单
 * @param dto
 */
export async function unifiedorder(dto) {
  const { data } = await axios.post('api/admin/order/unifiedorder', dto);
  return data;
}


/**
 * 获取购物车运费
 * @param dto
 */
export async function getLogisticsFeeByCart(dto) {
  const { data } = await axios.post('api/admin/order/logistics/agent', dto);
  return data.data;
}

/**
 * 获取立即购买运费
 * @param dto
 */
export async function getLogisticsFeeByGoods(dto) {
  const { data } = await axios.post('api/admin/order/logistics/agent/bygoods', dto);
  return data.data;
}

/**
 * c端用户调用微信支付统一下单
 * @param dto
 */
export async function userUnifiedorder(dto) {
  const { data } = await axios.post('api/admin/order/user/bymachine', dto, {
    headers: {
      'X-Token-Needed': false,
    },
  });
  return data;
}


export async function addToCart(dto) {
  await axios.post('api/admin/shoppingcart/batchSave', dto);
}

export async function fetchGoodsInCart() {
  const {
    data: {
      data: { records },
    },
  } = await axios.get('api/admin/shoppingcart/page', { params: PAGINATION });

  return records;
}

export async function removeGoodsById(id) {
  await axios.delete(`api/admin/shoppingcart/${id}`);
}

export async function changeNumById(id, num) {
  await axios.put(`api/admin/shoppingcart`, { id, num });
}

export async function fetchProcurementOrders(dto?) {
  const {
    data: {
      data: { records },
    },
  } = await axios.get('api/admin/order/agent/page', {
    params: { ...dto, ...PAGINATION },
  });

  return records;
}

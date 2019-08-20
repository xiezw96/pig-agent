import { PAGINATION } from '@/constants';
import axios from 'axios';

import { SearchOrder } from './search-order.dto';

/**
 * 订单查询
 */
export class SaleOrderService {
  async getSaleOrder(dto?: SearchOrder) {
    const {
      data: {
        data,
      },
    } = await axios.get('api/admin/orderdetail/agent/saleorder', {
      params: { ...dto, ...PAGINATION, descs: 'o.create_time'},
    });
    return data;
  }
}

export const saleOrderService = new SaleOrderService();

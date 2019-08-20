import axios from 'axios';

import { PAGINATION } from '@/constants';

export class GoodsService {
  async find(dto?: any) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/goods/page', {
      params: { ...dto, ...PAGINATION },
    });

    return records;
  }

  async findById(id) {
    const { data } = await axios.get(`api/admin/goods/${id}`);
    return data;
  }
}

export const goodsService = new GoodsService();

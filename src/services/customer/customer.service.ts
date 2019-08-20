import axios from 'axios';

import { PAGINATION } from '@/constants';

export class CustomerService {
  async find(dto: any) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/fxuser/page', {
      params: { ...dto, ...PAGINATION },
    });

    return records;
  }
}

export const customerService = new CustomerService();

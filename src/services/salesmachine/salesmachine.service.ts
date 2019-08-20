import axios from 'axios';

import { PAGINATION } from '@/constants';

export class Salesmachine {
  async find(dto?: any) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/salesmachine/page', {
      params: { ...dto, ...PAGINATION },
    });

    return records;
  }
}

export const salesmachine = new Salesmachine();

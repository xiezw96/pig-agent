import axios from 'axios';

import { PAGINATION } from '@/constants';

export class ComboService {
  async find() {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/combomanage/page', {
      params: { ...PAGINATION },
    });

    return records;
  }

  async create(dto?: any) {
    await axios.post('api/admin/voucher', dto);
  }

  async selectcombo(dto) {
    const { data } = await axios.post('api/admin/agentcombo/selectcombo', dto);
    return data.data;
  }

  async getComboTotalMoney(dto) {
    const { data } = await axios.post('api/admin/agentcombo/selectcombo/totalmoney', dto);
    return data.data;
  }
  async unifiedorder(dto) {
    const { data } = await axios.post('api/admin/agentcombo/unifiedorder', dto);
    return data;
  }
}

export const comboService = new ComboService();

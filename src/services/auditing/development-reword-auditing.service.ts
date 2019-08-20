import axios from 'axios';

import { PAGINATION } from '@/constants';

export class DevelopmentRewordAuditingService {
  async find(dto) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('', {
      params: { ...dto, ...PAGINATION },
    });

    return records;
  }

  async update(id: number, dto) {
    await axios.post('', { id, ...dto });
  }

  async findRewards(agentId: number) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('', {
      params: { id: agentId },
    });

    return records;
  }
}

export const developmentRewordAuditingService = new DevelopmentRewordAuditingService();

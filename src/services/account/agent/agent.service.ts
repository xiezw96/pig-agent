import axios from 'axios';

import { PAGINATION } from '@/constants';
import { AgentEntity } from '@/entities';
import { ResponseDataWrapper } from '@/interfaces';

export class AgentService {
  async find(dto?: any) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/agent/page', {
      params: { ...dto, ...PAGINATION },
    });

    return records;
  }

  async create(dto: any) {
    await axios.post('api/admin/agent', dto);
  }

  async get() {
    const {
      data: { data },
    } = await axios.get<ResponseDataWrapper<AgentEntity>>('api/admin/agent');
    return data;
  }
  async isexists(phone: string) {
    const { data } = await axios.get('api/admin/agent/isexists', {
      headers: {
        'X-Token-Needed': false,
      },
      params: {
        phone,
      },
    });
    return data;
  }

  async update(id: number, dto: any) {
    const { data } = await axios.put('api/admin/agent', { id, ...dto });
    return data;
  }

  async edit(id: number, dto: any) {
    const { data } = await axios.put('api/admin/agent/edit', { id, ...dto });
    return data;
  }

  async requestUpdate(id: number, dto: any) {
    const { data } = await axios.put('api/admin/agent/requestUpdate', {
      id,
      ...dto,
    });
    return data;
  }

  async regist(dto: any) {
    return await axios.post(
      `api/admin/agent/regist`,
      { ...dto },
      {
        headers: {
          'X-Token-Needed': false,
        },
      },
    );
  }

  async resetPwd(dto: any) {
    const { data } = await axios.put(
      `api/admin/agent/resetPwd`,
      { ...dto },
      {
        headers: {
          'X-Token-Needed': false,
        },
      },
    );
    return data;
  }

  async transactionpwd(dto: any) {
    const { data } = await axios.put(`api/admin/agent/transactionpwd`, {
      ...dto,
    });
    return data;
  }
}

export const agentService = new AgentService();

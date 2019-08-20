import { PAGINATION } from '@/constants';
import axios from 'axios';
/**
 * 结算申请
 */
export class SettlementService {
  async settlementSum() {
    const { data } = await axios.get('api/admin/settlementdetail/sum');
    return data;
  }
  async applySettlement(dto: any) {
    const { data } = await axios.post('api/admin/agentsettlement', dto);
    return data;
  }
  async getSettlementPage(dto: any) {
    const { data: {
      data,
      },
    } = await axios.get('api/admin/agentsettlement/agent/page',  {
      params: {...dto},
    });
    return data;
  }
  async getSettlementDetail(dto: any) {
    const { data: {
      data,
      },
     } = await axios.get('api/admin/settlementdetail/page',  {
      params: {...dto, ...PAGINATION},
    });
    return data;
  }
}

export const settlementService = new SettlementService();


import { PAGINATION } from '@/constants';
import axios from 'axios';

import { SearchWithdrawal } from './search-withdrawal.dto';

/**
 * 订单查询
 */
export class WithdrawalService {
  /**
   * 获取可提现金额
   */
  async withdrawalPrice() {
    const { data } = await axios.get('api/admin/agent/withdrawal_price');
    return data;
  }
  /**
   * 获取申请单分页列表
   * @param dto
   */
  async getWithdrawalPage(dto: SearchWithdrawal) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/withdrawalapply/page/agenet', {
      params: { ...PAGINATION, ...dto },
    });

    return records;
  }
  async applyWithdrawalRequest(dto: any) {
    const { data } = await axios.post(
      'api/admin/withdrawalapply/request',
      dto,
    );
    return data;
  }
}

export const withdrawalService = new WithdrawalService();

import { RewardAuditedStatus, WithdrawAuditedStatus } from '@/enums';
import { getEnumNameByCode } from '@/utils';

export function getRewardAuditedStatusByCode(code) {
  return getEnumNameByCode(RewardAuditedStatus, code);
}

export function getWithdrawAuditedStatusByCode(code) {
  return getEnumNameByCode(WithdrawAuditedStatus, code);
}

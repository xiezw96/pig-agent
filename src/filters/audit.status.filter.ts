import { AuditStatus } from '@/enums';

export function auditStatus(v: number) {
  return AuditStatus[v];
}

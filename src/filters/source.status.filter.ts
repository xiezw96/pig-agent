import { SourceStatus } from '@/enums';
import { getEnumNameByCode } from '@/utils';

export function sourceStatus(code: number) {
  return getEnumNameByCode(SourceStatus, code);
}

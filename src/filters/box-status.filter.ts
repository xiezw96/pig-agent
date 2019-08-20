import { BoxStatus } from '@/enums';
import { getEnumNameByCode } from '@/utils';

export function getBoxStatusByCode(code) {
  return getEnumNameByCode(BoxStatus, code);
}

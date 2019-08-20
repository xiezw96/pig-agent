import { has, isFinite, isPlainObject, toNumber } from 'lodash';

import { RemitStatus } from '@/enums';

export function getEnumNameByCode(enumeration, code) {
  if (!isPlainObject(enumeration)) return '';

  const num = toNumber(code);

  if (!isFinite(num)) return '';

  if (!has(enumeration, num)) return '';

  return enumeration[num];
}

export function getRemitStatusByCode(code) {
  return getEnumNameByCode(RemitStatus, code);
}

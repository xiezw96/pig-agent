import { DeviceStatus } from '@/enums';

export function deviceStatus(v: number) {
  return DeviceStatus[v];
}

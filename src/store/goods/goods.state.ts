import { DeviceState } from './device.state';
import { GoodsActionState } from './goods';
import { GroupState } from './group.state';

export interface GoodsState {
  device: DeviceState;
  goods: GoodsActionState;
  group: GroupState;
}

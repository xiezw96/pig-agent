// import { AccountState } from './account';
// import { GoodsState } from './goods';
// import { SettingState } from './setting';
import { EquipmentState } from './equipment';
import { MallState } from './mall';
import { PersonalState } from './personal';
import { OrderState } from './saleorder';
import { SettlementState } from './settlement';
import { WithdrawalState } from './withdrawal';
import { WorkspaceState } from './workspace';

export interface RootState {
  personal: PersonalState;
  workspace: WorkspaceState;
  saleOrder: OrderState;
  settlement: SettlementState;
  withdrawal: WithdrawalState;
  // account: AccountState;
  // goods: GoodsState;
  // setting: SettingState;
  mall: MallState;
  equipment: EquipmentState;
}

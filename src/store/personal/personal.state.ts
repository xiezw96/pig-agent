import { AddressState } from './address.state';
import { CouponState } from './coupon.state';

export interface PersonalState {
  address: AddressState;
  coupon: CouponState;
}

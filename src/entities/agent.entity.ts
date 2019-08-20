export class AgentEntity {
  /**
   * 激活状态
   */
  activeStatus: number | null;

  /**
   * 审核状态
   */
  auditStatus: number | null;

  agentId: number;
  name: string;
  level: number;
  photo: string;
  sex: string;
  birthday: string;
  phone: string;
  privince: string;
  city: string;
  area: string;
  company: string;
  address: string;
  wechatId: string;
  idCard: string;
  referrerId: string;
  referrerName: string;
  identityCardFront: string;
  identityCardVerso: string;
  newIdentityCardFront: string;
  newIdentityCardVerso: string;
  bankCardFront: string;
  bankCardVerso: string;
  newBankCardFront: string;
  newBankCardVerso: string;
}

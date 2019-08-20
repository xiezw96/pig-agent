import axios from 'axios';

import { SmsDto } from './sms.dto';

export class SmsService {
  async sendCode(dto: SmsDto) {
    return await axios.get('api/admin/smscode', {
      headers: {
        'X-Token-Needed': false,
      },
      params: {
        ...dto,
      },
    });
  }
  async token(dto: SmsDto) {
    return await axios.get('api/admin/smscode/token', {
      headers: {
        'X-Token-Needed': false,
      },
      params: {
        ...dto,
      },
    });
  }
  async verify(dto: SmsDto) {
    return await axios.get('api/admin/smscode/verify', {
      headers: {
        'X-Token-Needed': false,
      },
      params: {
        ...dto,
      },
    });
  }
}

export const smsService = new SmsService();


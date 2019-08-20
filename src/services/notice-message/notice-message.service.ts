import axios from 'axios';

import { PAGINATION } from '@/constants';

export class NoticeMessageService {
  async findNotice(dto?: any) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/notice/enabled/page', {
      params: { ...dto, ...PAGINATION },
    });

    return records;
  }

  async findMessage(dto?: any) {
    const {
      data: {
        data: { records },
      },
    } = await axios.get('api/admin/message/page', {
      params: { ...dto, ...PAGINATION },
    });

    return records;
  }

  async updateNotice(dto: any) {
    await axios.put('api/admin/notice', { ...dto });
  }

  async updateMessage(dto: any) {
    await axios.put('api/admin/message', { ...dto });
  }
}

export const noticeMessageService = new NoticeMessageService();

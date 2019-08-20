import axios from 'axios';

import { CreateAnnouncementDto } from './create-announcements.dto';

export class AnnouncementService {

  async create(dto: CreateAnnouncementDto) {
    await axios.post('api/admin/notice', dto);
  }

  async update(id: number, dto: CreateAnnouncementDto) {
    await axios.put('api/admin/notice', { id, ...dto });
  }
}

export const announcementService = new AnnouncementService();

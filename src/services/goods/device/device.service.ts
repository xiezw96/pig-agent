import axios from 'axios';

import { FindDevicesDto } from './find-devices.dto';

export class DeviceService {
  async find(dto?: FindDevicesDto) {
    const {
      data: { data },
    } = await axios.get('api/admin/salesmachine/page', {
      params: dto,
    });

    return data;
  }

  async export(dto?: FindDevicesDto) {
    // TODO
  }

  async update(id: number, status: number) {
    // TODO
  }
}

export const deviceService = new DeviceService();

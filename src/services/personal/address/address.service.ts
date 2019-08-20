import axios from 'axios';

import { CreateAddressDto } from './create-address.dto';

import { PAGINATION } from '@/constants';

const moduleName = 'shoppingaddress';

export class AddressService {
  async find() {
    const {
      data: {
        data: { records },
      },
    } = await axios.get(`api/admin/${moduleName}/page`, {
      params: { ...PAGINATION },
    });
    return records;
  }

  async create(dto: CreateAddressDto) {
    await axios.post(`api/admin/${moduleName}`, dto);
  }

  async update(id: number, dto: CreateAddressDto) {
    await axios.put(`api/admin/${moduleName}`, { id, ...dto });
  }

  async remove(id: number) {
    await axios.delete(`api/admin/${moduleName}/${id}`);
  }
}

export const addressService = new AddressService();

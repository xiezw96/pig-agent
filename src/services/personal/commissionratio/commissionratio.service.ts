import axios from 'axios';

import { CreateCommissionratioDto } from './create-commissionratio.dto';

// const actiName = 'commissionratio';

export class CommissionratioService {

  // async get(dto: CreateCommissionratioDto) {
  //   await axios.post(`api/admin/${moduleName}`, dto);
  // }


  async update(dto: CreateCommissionratioDto) {
    await axios.put('api/admin/agent/commissionratio', (dto.ratio / 100), {
      headers:{
        'content-type': 'application/json',
      },
    });
  }

  
}

export const commissionratioService = new CommissionratioService();

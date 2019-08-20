import { PAGINATION } from '@/constants';
import axios from 'axios';
/**
 * 结算申请
 */
export class TemplateService {
  async getTemplatePage(dto?: any) {
    const { data: {
      data,
      },
    } = await axios.get('api/admin/machinetemplate/agent/page',  {
      params: {...dto, ...PAGINATION},
    });
    return data.records;
  }
  async getTemplateDetail(id: number) {
    const { data: {
      data,
      },
     } = await axios.get(`api/admin/machinetemplate/${id}`);
    return data;
  }
  async saveTemplate(dto: any) {
    const { data } = await axios.post('api/admin/machinetemplate', {...dto});
    return data;
  }
  async updateTemplate(dto: any) {
    const { data } = await axios.put('api/admin/machinetemplate', {...dto});
    return data;
  }
  async machineSetTemplate(dto: SetTemplateDTO) {
    const { data } = await axios.post('api/admin/machinetemplate/machineSetTemplate', {...dto});
    return data;
  }
  async remove(id: number) {
    await axios.delete(`api/admin/machinetemplate/${id}`);
  }
}

export const templateService = new TemplateService();

interface SetTemplateDTO {
  id: number;
  machineId: number;
}

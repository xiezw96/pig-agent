import axios from 'axios';

export async function fetchReport() {
  const {
    data: { data },
  } = await axios.get('api/admin/agentapp/data_report');

  return data;
}

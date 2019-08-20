import axios from 'axios';

export async function fetchEquipments() {
  const {
    data: { data },
  } = await axios.get('api/admin/salesmachine/agent/select');

  return data;
}

export async function fetchEquipment(id) {
  const {
    data: { data },
  } = await axios.get('api/admin/salesmachine/agent/info', { params: { id } });

  return data;
}

/**
 * 打开柜门
 */
export async function openGate(id) {
  await axios.get(`api/admin/salesmachineaisle/agent/openone/${id}`);
}

export async function openAllGate(id) {
  await axios.get(`api/admin/salesmachineaisle/agent/openall/${id}`);
}

/**
 * 故障申报
 */
export async function reportMalfunction(dto) {
  await axios.post('api/admin/salesmachinefault', dto);
}

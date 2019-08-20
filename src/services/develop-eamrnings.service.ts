import axios from 'axios';

import { PAGINATION } from '@/constants';

export async function recommand(dto) {
  await axios.post('api/admin/agent/referral', dto);
}

export async function getReward() {
  const {
    data: { data },
  } = await axios.get('api/admin/developaudit/agent/data');

  return data;
}

export async function getApplicationDetail(id) {
  const {
    data: { data },
  } = await axios.get(`api/admin/developaudit/info/${id}`);

  return data;
}

export async function fetchApplicationList(dto?) {
  const {
    data: {
      data: { records },
    },
  } = await axios.get('api/admin/developaudit/page/agent', {
    params: { ...PAGINATION, ...dto },
  });

  return records;
}

export async function applyReward(dto) {
  await axios.post('api/admin/developaudit/request', {...dto});
}

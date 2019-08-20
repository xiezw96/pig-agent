import { areaList, cityList, provinceList } from '@/constants/areas';

export function address(value) {
  const [privinceCode, cityCode, areaCode] = value;
  const province = provinceList.find(i => i.value === privinceCode);
  const city = cityList[privinceCode].find(i => i.value === cityCode);
  const area = areaList[cityCode].find(i => i.value === areaCode);
  const full = province.text + city.text + area.text;
  return full;
}

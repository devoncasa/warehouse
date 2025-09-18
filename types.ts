export type YesNoUnspecified = 'ใช่' | 'ไม่ใช่' | 'ไม่ระบุ';
export type Ror4Status = 'มี' | 'ไม่มี' | 'ไม่ระบุ';
export type FloodRisk = 'ต่ำ' | 'ปานกลาง' | 'สูง' | 'ไม่มีข้อมูล';

export interface Warehouse {
  id: number;
  projectName: string;
  location: string;
  googleMapsLink: string;
  area: number | '';
  height: number | '';
  rentPerSqm: number | '';
  totalPrice: number;
  depositMonths: number | '';
  floorLoad: number | '';
  loadingBays: number | '';
  hasDockLeveler: YesNoUnspecified;
  electricity: string;
  hasFiberOptic: YesNoUnspecified;
  hasSecurity: YesNoUnspecified;
  hasSprinkler: YesNoUnspecified;
  nearExpressway: YesNoUnspecified;
  isPurpleZone: YesNoUnspecified;
  hasRor4: Ror4Status;
  floodRisk: FloodRisk;
  notes: string;
}
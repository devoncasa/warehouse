export type YesNoUnspecified = 'ใช่' | 'ไม่ใช่' | 'ไม่ระบุ';
export type Ror4Status = 'มี' | 'ไม่มี' | 'ไม่ระบุ';
export type FloodRisk = 'ต่ำ' | 'ปานกลาง' | 'สูง' | 'ไม่มีข้อมูล';

export interface Warehouse {
  id: number;
  // General
  projectName: string;
  location: string;
  googleMapsLink: string;
  area: number | '';
  usableAreaBreakdown: string; // e.g., "Warehouse 7000 sqm, Office 200 sqm"
  buildingType: string; // e.g., "Single building", "Shared unit"
  height: number | ''; // Clear Height

  // Costs & Lease
  rentPerSqm: number | '';
  totalPrice: number;
  depositMonths: number | '';
  leaseTerms: string; // e.g., "Min 3 years, 5% increase every 3 years"
  hiddenCosts: string; // e.g., "Common area fee, building tax"
  
  // Structure & Specs
  floorLoad: number | '';
  loadingBays: number | '';
  hasDockLeveler: YesNoUnspecified;
  roofStructure: string; // e.g., "Insulated, with skylights"

  // Utilities
  electricity: string;
  waterSupply: string;
  wasteManagement: string;
  hasFiberOptic: YesNoUnspecified;

  // Safety & Facilities
  hasSecurity: YesNoUnspecified; // 24h Guard
  cctv: YesNoUnspecified;
  hasSprinkler: YesNoUnspecified;
  fireSafetySystems: string; // e.g., "Fire Alarm, Hydrant, Fire Exit"
  parking: string; // e.g., "10 trucks, 20 cars"
  officeFacilities: string; // e.g., "Meeting room, restrooms"
  
  // Logistics
  nearExpressway: YesNoUnspecified;
  logisticsProximity: string; // e.g., "Near Suvarnabhumi Airport, Klong Toey Port"
  truckAccessRestrictions: string; // e.g., "No time restrictions"

  // Potential & Risks
  isPurpleZone: YesNoUnspecified;
  hasRor4: Ror4Status;
  floodRisk: FloodRisk;
  expansionPotential: string;
  
  // Photos
  photos: string[]; // Array of Base64 image strings

  // Notes
  notes: string;
}
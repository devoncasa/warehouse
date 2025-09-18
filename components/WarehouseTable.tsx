import React, { useState } from 'react';
import { Warehouse, YesNoUnspecified, Ror4Status, FloodRisk } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface WarehouseTableProps {
  warehouses: Warehouse[];
  onUpdate: (id: number, field: keyof Warehouse, value: any) => void;
  onRemove: (id: number) => void;
}

const WarehouseTable: React.FC<WarehouseTableProps> = ({ warehouses, onUpdate, onRemove }) => {
  const [errors, setErrors] = useState<Record<number, Partial<Record<keyof Warehouse, string>>>>({});
  
  const yesNoOptions: YesNoUnspecified[] = ['ใช่', 'ไม่ใช่', 'ไม่ระบุ'];
  const ror4Options: Ror4Status[] = ['มี', 'ไม่มี', 'ไม่ระบุ'];
  const floodRiskOptions: FloodRisk[] = ['ต่ำ', 'ปานกลาง', 'สูง', 'ไม่มีข้อมูล'];

  const handleNumericChange = (id: number, field: keyof Warehouse, value: string) => {
    const numValue = Number(value);

    setErrors(prev => {
        const newErrors = { ...prev };
        if (!newErrors[id]) newErrors[id] = {};

        if (value !== '' && (isNaN(numValue) || numValue <= 0)) {
            newErrors[id][field] = 'ต้องเป็นตัวเลขมากกว่า 0';
        } else {
            delete newErrors[id][field];
        }
        return newErrors;
    });
    
    onUpdate(id, field, value === '' ? '' : numValue);
  };
  
  const commonInputClass = "w-full text-lg p-2.5 border rounded-md bg-white disabled:bg-stone-50";
  const validBorderClass = "border-stone-300 focus:ring-stone-500 focus:border-stone-500";
  const invalidBorderClass = "border-red-500 focus:ring-red-500 focus:border-red-500";
  
  const commonSelectClass = "w-full text-lg p-2.5 border border-stone-300 rounded-md focus:ring-stone-500 focus:border-stone-500 bg-white";
  const commonLabelClass = "block text-base font-medium text-stone-700 mb-1.5";

  return (
    <div className="space-y-8">
      {warehouses.map((w, index) => (
        <div key={w.id} className="bg-white p-6 rounded-lg shadow-lg relative transition-shadow hover:shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
            <h2 className="text-2xl font-bold text-stone-800">
              ข้อมูลโกดัง #{index + 1}
            </h2>
            <button 
                onClick={() => onRemove(w.id)} 
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                aria-label={`Remove warehouse ${index + 1}`}
            >
              <TrashIcon />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
            <div className="lg:col-span-2">
              <label htmlFor={`projectName-${w.id}`} className={commonLabelClass}>ชื่อโครงการ/เจ้าของ</label>
              <input id={`projectName-${w.id}`} type="text" value={w.projectName} onChange={(e) => onUpdate(w.id, 'projectName', e.target.value)} className={`${commonInputClass} ${validBorderClass}`} />
            </div>
            <div className="lg:col-span-2">
              <label htmlFor={`location-${w.id}`} className={commonLabelClass}>ที่ตั้ง (กม.)</label>
              <input id={`location-${w.id}`} type="text" value={w.location} onChange={(e) => onUpdate(w.id, 'location', e.target.value)} placeholder="เช่น บางนา กม.25" className={`${commonInputClass} ${validBorderClass}`} />
            </div>
            <div className="lg:col-span-4">
              <label htmlFor={`googleMapsLink-${w.id}`} className={commonLabelClass}>ลิงก์ Google Maps</label>
              <input id={`googleMapsLink-${w.id}`} type="url" value={w.googleMapsLink} onChange={(e) => onUpdate(w.id, 'googleMapsLink', e.target.value)} placeholder="https://maps.app.goo.gl/..." className={`${commonInputClass} ${validBorderClass}`} />
            </div>
             <div>
              <label htmlFor={`area-${w.id}`} className={commonLabelClass}>พื้นที่ใช้สอย (ตร.ม.)</label>
              <input id={`area-${w.id}`} type="number" value={w.area} onChange={(e) => handleNumericChange(w.id, 'area', e.target.value)} placeholder="7150" className={`${commonInputClass} ${errors[w.id]?.area ? invalidBorderClass : validBorderClass }`} aria-invalid={!!errors[w.id]?.area} aria-describedby={`area-error-${w.id}`}/>
              {errors[w.id]?.area && <p id={`area-error-${w.id}`} className="mt-1 text-sm text-red-600">{errors[w.id]?.area}</p>}
            </div>
            <div>
              <label htmlFor={`height-${w.id}`} className={commonLabelClass}>ความสูง (ม.)</label>
              <input id={`height-${w.id}`} type="number" value={w.height} onChange={(e) => handleNumericChange(w.id, 'height', e.target.value)} placeholder="10" className={`${commonInputClass} ${errors[w.id]?.height ? invalidBorderClass : validBorderClass }`} aria-invalid={!!errors[w.id]?.height} aria-describedby={`height-error-${w.id}`}/>
               {errors[w.id]?.height && <p id={`height-error-${w.id}`} className="mt-1 text-sm text-red-600">{errors[w.id]?.height}</p>}
            </div>
            <div>
              <label htmlFor={`rentPerSqm-${w.id}`} className={commonLabelClass}>ค่าเช่า (บาท/ตร.ม.)</label>
              <input id={`rentPerSqm-${w.id}`} type="number" value={w.rentPerSqm} onChange={(e) => handleNumericChange(w.id, 'rentPerSqm', e.target.value)} placeholder="150" className={`${commonInputClass} ${errors[w.id]?.rentPerSqm ? invalidBorderClass : validBorderClass }`} aria-invalid={!!errors[w.id]?.rentPerSqm} aria-describedby={`rentPerSqm-error-${w.id}`}/>
               {errors[w.id]?.rentPerSqm && <p id={`rentPerSqm-error-${w.id}`} className="mt-1 text-sm text-red-600">{errors[w.id]?.rentPerSqm}</p>}
            </div>
             <div className="flex flex-col justify-end">
              <label className={commonLabelClass}>ราคารวม (ต่อเดือน)</label>
              <span className="font-mono text-xl text-stone-900 mt-1 h-[50px] flex items-center px-2.5">
                {w.totalPrice > 0 ? w.totalPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }).replace('฿', '') : 'คำนวณอัตโนมัติ'}
              </span>
            </div>
            <div>
              <label htmlFor={`depositMonths-${w.id}`} className={commonLabelClass}>เงินมัดจำ (เดือน)</label>
              <input id={`depositMonths-${w.id}`} type="number" value={w.depositMonths} onChange={(e) => handleNumericChange(w.id, 'depositMonths', e.target.value)} placeholder="3" className={`${commonInputClass} ${errors[w.id]?.depositMonths ? invalidBorderClass : validBorderClass }`} aria-invalid={!!errors[w.id]?.depositMonths} aria-describedby={`depositMonths-error-${w.id}`}/>
               {errors[w.id]?.depositMonths && <p id={`depositMonths-error-${w.id}`} className="mt-1 text-sm text-red-600">{errors[w.id]?.depositMonths}</p>}
            </div>
            <div>
              <label htmlFor={`floorLoad-${w.id}`} className={commonLabelClass}>พื้นรับน้ำหนัก (ตัน/ตร.ม.)</label>
              <input id={`floorLoad-${w.id}`} type="number" value={w.floorLoad} onChange={(e) => handleNumericChange(w.id, 'floorLoad', e.target.value)} placeholder="3" className={`${commonInputClass} ${errors[w.id]?.floorLoad ? invalidBorderClass : validBorderClass }`} aria-invalid={!!errors[w.id]?.floorLoad} aria-describedby={`floorLoad-error-${w.id}`}/>
               {errors[w.id]?.floorLoad && <p id={`floorLoad-error-${w.id}`} className="mt-1 text-sm text-red-600">{errors[w.id]?.floorLoad}</p>}
            </div>
            <div>
              <label htmlFor={`loadingBays-${w.id}`} className={commonLabelClass}>Loading Bay</label>
              <input id={`loadingBays-${w.id}`} type="number" value={w.loadingBays} onChange={(e) => handleNumericChange(w.id, 'loadingBays', e.target.value)} placeholder="6" className={`${commonInputClass} ${validBorderClass}`} />
            </div>
            <div>
              <label htmlFor={`electricity-${w.id}`} className={commonLabelClass}>ไฟฟ้า (KVA)</label>
              <input id={`electricity-${w.id}`} type="text" value={w.electricity} onChange={(e) => onUpdate(w.id, 'electricity', e.target.value)} placeholder="315" className={`${commonInputClass} ${validBorderClass}`} />
            </div>
            <div>
              <label htmlFor={`dockLeveler-${w.id}`} className={commonLabelClass}>Dock Leveler</label>
              <select id={`dockLeveler-${w.id}`} value={w.hasDockLeveler} onChange={(e) => onUpdate(w.id, 'hasDockLeveler', e.target.value)} className={commonSelectClass}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <label htmlFor={`fiberOptic-${w.id}`} className={commonLabelClass}>Fiber Optic</label>
              <select id={`fiberOptic-${w.id}`} value={w.hasFiberOptic} onChange={(e) => onUpdate(w.id, 'hasFiberOptic', e.target.value)} className={commonSelectClass}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <label htmlFor={`security-${w.id}`} className={commonLabelClass}>รปภ. 24 ชม.</label>
              <select id={`security-${w.id}`} value={w.hasSecurity} onChange={(e) => onUpdate(w.id, 'hasSecurity', e.target.value)} className={commonSelectClass}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <label htmlFor={`sprinkler-${w.id}`} className={commonLabelClass}>Sprinkler</label>
              <select id={`sprinkler-${w.id}`} value={w.hasSprinkler} onChange={(e) => onUpdate(w.id, 'hasSprinkler', e.target.value)} className={commonSelectClass}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <label htmlFor={`expressway-${w.id}`} className={commonLabelClass}>ใกล้ทางด่วน</label>
              <select id={`expressway-${w.id}`} value={w.nearExpressway} onChange={(e) => onUpdate(w.id, 'nearExpressway', e.target.value)} className={commonSelectClass}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <label htmlFor={`purpleZone-${w.id}`} className={commonLabelClass}>พื้นที่สีม่วง</label>
              <select id={`purpleZone-${w.id}`} value={w.isPurpleZone} onChange={(e) => onUpdate(w.id, 'isPurpleZone', e.target.value)} className={commonSelectClass}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <label htmlFor={`ror4-${w.id}`} className={commonLabelClass}>ใบอนุญาต รง.4</label>
              <select id={`ror4-${w.id}`} value={w.hasRor4} onChange={(e) => onUpdate(w.id, 'hasRor4', e.target.value)} className={commonSelectClass}>{ror4Options.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <label htmlFor={`floodRisk-${w.id}`} className={commonLabelClass}>ความเสี่ยงน้ำท่วม</label>
              <select id={`floodRisk-${w.id}`} value={w.floodRisk} onChange={(e) => onUpdate(w.id, 'floodRisk', e.target.value)} className={commonSelectClass}>{floodRiskOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div className="lg:col-span-4">
              <label htmlFor={`notes-${w.id}`} className={commonLabelClass}>หมายเหตุ/จุดเด่น</label>
              <input id={`notes-${w.id}`} type="text" value={w.notes} onChange={(e) => onUpdate(w.id, 'notes', e.target.value)} className={`${commonInputClass} ${validBorderClass}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WarehouseTable;
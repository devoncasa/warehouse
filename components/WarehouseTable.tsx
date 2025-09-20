import React, { useState } from 'react';
import { Warehouse, YesNoUnspecified, Ror4Status, FloodRisk, Photo } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';

interface WarehouseTableProps {
  warehouses: Warehouse[];
  onUpdate: (id: number, field: keyof Warehouse, value: any) => void;
  onRemove: (id: number) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="pt-5">
    <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
      {children}
    </div>
  </div>
);

const Label: React.FC<{ htmlFor: string; title: string; description: string }> = ({ htmlFor, title, description }) => (
    <label htmlFor={htmlFor} className="block text-base font-medium text-slate-700 mb-1.5">
        {title}
        <span className="block text-slate-500 font-normal text-sm">{description}</span>
    </label>
);


const WarehouseTable: React.FC<WarehouseTableProps> = ({ warehouses, onUpdate, onRemove }) => {
  const [errors, setErrors] = useState<Record<number, Partial<Record<keyof Warehouse, string>>>>({});
  
  const yesNoOptions: YesNoUnspecified[] = ['มี', 'ไม่มี', 'ไม่ระบุ'];
  const ror4Options: Ror4Status[] = ['มี', 'ไม่มี', 'ไม่ระบุ'];
  const floodRiskOptions: FloodRisk[] = ['ต่ำ', 'ปานกลาง', 'สูง', 'ไม่มีข้อมูล'];

  const structureOptions = {
    column: ['ไม่ระบุ', 'คอนกรีตเสริมเหล็ก (Reinforced Concrete)', 'เสาเหล็ก H-Beam / I-Beam'],
    roofFrame: ['ไม่ระบุ', 'โครงเหล็ก (H-Beam, I-Beam, Space Frame)', 'Truss Steel (โครงข้อหมุน)'],
    roofing: ['ไม่ระบุ', 'เมทัลชีท (Metal Sheet)', 'เมทัลชีท PU Foam / Sandwich Panel', 'แทรกแผ่นโปร่งแสง (Translucent Sheet)'],
    walling: ['ไม่ระบุ', 'ผนังเมทัลชีท (Metal Sheet)', 'ผนังก่ออิฐฉาบปูน (Brick Wall)', 'Sandwich Panel'],
    flooring: ['ไม่ระบุ', 'พื้นคอนกรีตเสริมเหล็ก (Reinforced Concrete)', 'พื้นคอนกรีต Heavy Duty', 'เคลือบ Epoxy / Hardened Floor'],
    doors: ['ไม่ระบุ', 'ประตูเหล็กม้วน (Roller Shutter)', 'ประตูบานสไลด์ (Sliding Door)'],
    weatherProtection: ['ไม่ระบุ', 'กันสาด (Canopy)', 'ระบบระบายอากาศ (Ventilation)', 'ฉนวนกันความร้อน (Roof Insulation)'],
    optionalSystems: ['ไม่ระบุ', 'ไฟ LED High Bay', 'Solar Roof'],
  };

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
  
    const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => 
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
    });

    const handlePhotoUpload = async (id: number, currentPhotos: Photo[], files: FileList | null) => {
        if (!files) return;

        const photoLimit = 15;
        const remainingSlots = photoLimit - currentPhotos.length;

        if (files.length > remainingSlots) {
            alert(`สามารถอัปโหลดได้อีก ${remainingSlots} รูปเท่านั้น (สูงสุด 15 รูป)`);
        }

        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        const newPhotos: Photo[] = [];

        for (const file of filesToProcess) {
            try {
                const base64 = await toBase64(file);
                if (typeof base64 === 'string') {
                    newPhotos.push({ url: base64, comment: '' });
                }
            } catch (error) {
                console.error("Error converting file to Base64:", error);
            }
        }
        
        onUpdate(id, 'photos', [...currentPhotos, ...newPhotos]);
    };

    const handleRemovePhoto = (id: number, currentPhotos: Photo[], indexToRemove: number) => {
        const newPhotos = currentPhotos.filter((_, index) => index !== indexToRemove);
        onUpdate(id, 'photos', newPhotos);
    };

    const handlePhotoCommentChange = (id: number, currentPhotos: Photo[], photoIndex: number, newComment: string) => {
        const updatedPhotos = currentPhotos.map((photo, index) => {
            if (index === photoIndex) {
                return { ...photo, comment: newComment };
            }
            return photo;
        });
        onUpdate(id, 'photos', updatedPhotos);
    };

  // --- Refactored Styles ---
  const baseInputStyles = "block w-full text-base text-black p-2.5 border rounded-md shadow-sm transition-colors duration-200 bg-white";
  const focusStyles = "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const normalBorderStyles = "border-slate-300";
  const errorBorderStyles = "border-red-500 text-red-900 placeholder-red-300";

  const getInputClassName = (hasError: boolean) => `${baseInputStyles} ${focusStyles} ${hasError ? errorBorderStyles : normalBorderStyles}`;
  
  const disabledInputStyles = "bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed";


  return (
    <div className="space-y-8">
      {warehouses.map((w, index) => (
        <div key={w.id} className="bg-white p-6 rounded-lg shadow-lg relative transition-shadow hover:shadow-xl">
          <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">
              ข้อมูลโกดัง #{index + 1}
            </h2>
            <button 
                onClick={() => onRemove(w.id)} 
                className={`text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors ${focusStyles}`}
                aria-label={`Remove warehouse ${index + 1}`}
            >
              <TrashIcon />
            </button>
          </div>
          
          <Section title="1. ข้อมูลทั่วไป (General Information)">
            <div className="lg:col-span-2">
              <Label htmlFor={`projectName-${w.id}`} title="ชื่อโครงการ/เจ้าของ" description="Project Name/Owner" />
              <input id={`projectName-${w.id}`} type="text" value={w.projectName} onChange={(e) => onUpdate(w.id, 'projectName', e.target.value)} className={getInputClassName(false)} />
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor={`location-${w.id}`} title="ที่ตั้ง (กม.)" description="Location (KM)" />
              <input id={`location-${w.id}`} type="text" value={w.location} onChange={(e) => onUpdate(w.id, 'location', e.target.value)} placeholder="เช่น บางนา กม.25" className={getInputClassName(false)} />
            </div>
            <div className="lg:col-span-4">
              <Label htmlFor={`googleMapsLink-${w.id}`} title="ลิงก์ Google Maps" description="Google Maps Link - Landmark near by" />
              <input id={`googleMapsLink-${w.id}`} type="url" value={w.googleMapsLink} onChange={(e) => onUpdate(w.id, 'googleMapsLink', e.target.value)} placeholder="https://maps.app.goo.gl/..." className={getInputClassName(false)} />
            </div>
             <div>
              <Label htmlFor={`area-${w.id}`} title="พื้นที่ใช้สอย (ตร.ม.)" description="Usable Area (sqm)" />
              <input id={`area-${w.id}`} type="number" value={w.area} onChange={(e) => handleNumericChange(w.id, 'area', e.target.value)} placeholder="7150" className={getInputClassName(!!errors[w.id]?.area)} />
              {errors[w.id]?.area && <p className="mt-1 text-sm text-red-600">{errors[w.id]?.area}</p>}
            </div>
            <div>
              <Label htmlFor={`usableAreaBreakdown-${w.id}`} title="สัดส่วนพื้นที่" description="Area Breakdown (Warehouse/Office)" />
              <input id={`usableAreaBreakdown-${w.id}`} type="text" value={w.usableAreaBreakdown} onChange={(e) => onUpdate(w.id, 'usableAreaBreakdown', e.target.value)} placeholder="โกดัง 7000, ออฟฟิศ 150" className={getInputClassName(false)} />
            </div>
             <div>
              <Label htmlFor={`buildingType-${w.id}`} title="ลักษณะอาคาร" description="Building Type" />
              <input id={`buildingType-${w.id}`} type="text" value={w.buildingType} onChange={(e) => onUpdate(w.id, 'buildingType', e.target.value)} placeholder="อาคารเดี่ยว" className={getInputClassName(false)} />
            </div>
            <div>
              <Label htmlFor={`height-${w.id}`} title="ความสูง (ม.)" description="Clear Height (m)" />
              <input id={`height-${w.id}`} type="number" value={w.height} onChange={(e) => handleNumericChange(w.id, 'height', e.target.value)} placeholder="10" className={getInputClassName(!!errors[w.id]?.height)} />
               {errors[w.id]?.height && <p className="mt-1 text-sm text-red-600">{errors[w.id]?.height}</p>}
            </div>
          </Section>

          <Section title="2. ค่าใช้จ่ายและสัญญาเช่า (Costs & Lease)">
            <div>
              <Label htmlFor={`rentPerSqm-${w.id}`} title="ค่าเช่า (บาท/ตร.ม.)" description="Rental Rate (THB/sqm)" />
              <input id={`rentPerSqm-${w.id}`} type="number" value={w.rentPerSqm} onChange={(e) => handleNumericChange(w.id, 'rentPerSqm', e.target.value)} placeholder="150" className={getInputClassName(!!errors[w.id]?.rentPerSqm)} />
               {errors[w.id]?.rentPerSqm && <p className="mt-1 text-sm text-red-600">{errors[w.id]?.rentPerSqm}</p>}
            </div>
             <div>
              <Label htmlFor={`totalPrice-${w.id}`} title="ราคารวม (ต่อเดือน)" description="Total Price (per month)" />
              <div id={`totalPrice-${w.id}`} className={`${baseInputStyles} ${disabledInputStyles} flex items-center`}>
                 {w.totalPrice > 0 ? w.totalPrice.toLocaleString('th-TH') : 'คำนวณอัตโนมัติ'}
              </div>
            </div>
            <div>
              <Label htmlFor={`depositMonths-${w.id}`} title="เงินมัดจำ (เดือน)" description="Deposit (months)" />
              <input id={`depositMonths-${w.id}`} type="number" value={w.depositMonths} onChange={(e) => handleNumericChange(w.id, 'depositMonths', e.target.value)} placeholder="3" className={getInputClassName(!!errors[w.id]?.depositMonths)} />
               {errors[w.id]?.depositMonths && <p className="mt-1 text-sm text-red-600">{errors[w.id]?.depositMonths}</p>}
            </div>
             <div className="lg:col-span-2">
                <Label htmlFor={`leaseTerms-${w.id}`} title="เงื่อนไขสัญญา" description="Lease Terms" />
                <input id={`leaseTerms-${w.id}`} type="text" value={w.leaseTerms} onChange={(e) => onUpdate(w.id, 'leaseTerms', e.target.value)} placeholder="ขั้นต่ำ 3 ปี, ขึ้นค่าเช่า 5% ทุก 3 ปี" className={getInputClassName(false)} />
            </div>
            <div className="lg:col-span-2">
                <Label htmlFor={`hiddenCosts-${w.id}`} title="ค่าใช้จ่ายแฝง" description="Hidden Costs" />
                <input id={`hiddenCosts-${w.id}`} type="text" value={w.hiddenCosts} onChange={(e) => onUpdate(w.id, 'hiddenCosts', e.target.value)} placeholder="ค่าส่วนกลาง, ภาษีโรงเรือน" className={getInputClassName(false)} />
            </div>
          </Section>

          <Section title="3. โครงสร้างอาคารและคุณสมบัติ (Structure & Specs)">
             <div>
              <Label htmlFor={`floorLoad-${w.id}`} title="พื้นรับน้ำหนัก (ตัน/ตร.ม.)" description="Floor Load (ton/sqm)" />
              <input id={`floorLoad-${w.id}`} type="number" value={w.floorLoad} onChange={(e) => handleNumericChange(w.id, 'floorLoad', e.target.value)} placeholder="3" className={getInputClassName(!!errors[w.id]?.floorLoad)} />
               {errors[w.id]?.floorLoad && <p className="mt-1 text-sm text-red-600">{errors[w.id]?.floorLoad}</p>}
            </div>
            <div>
              <Label htmlFor={`loadingBays-${w.id}`} title="Loading Bay" description="ช่องขนถ่ายสินค้า" />
              <input id={`loadingBays-${w.id}`} type="number" value={w.loadingBays} onChange={(e) => handleNumericChange(w.id, 'loadingBays', e.target.value)} placeholder="6" className={getInputClassName(false)} />
            </div>
             <div>
              <Label htmlFor={`dockLeveler-${w.id}`} title="Dock Leveler" description="สะพานปรับระดับ" />
              <select id={`dockLeveler-${w.id}`} value={w.hasDockLeveler} onChange={(e) => onUpdate(w.id, 'hasDockLeveler', e.target.value)} className={getInputClassName(false)}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            
            <div className="lg:col-span-4 mt-4 pt-4 border-t border-slate-200">
                <h4 className="text-base font-semibold text-slate-600 mb-3">โครงสร้างหลัก (Main Structure)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                    <div>
                        <Label htmlFor={`columnType-${w.id}`} title="เสา" description="Column" />
                        <select id={`columnType-${w.id}`} value={w.columnType} onChange={(e) => onUpdate(w.id, 'columnType', e.target.value)} className={getInputClassName(false)}>
                            {structureOptions.column.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor={`roofFrameType-${w.id}`} title="โครงหลังคา" description="Roof Frame" />
                        <select id={`roofFrameType-${w.id}`} value={w.roofFrameType} onChange={(e) => onUpdate(w.id, 'roofFrameType', e.target.value)} className={getInputClassName(false)}>
                            {structureOptions.roofFrame.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor={`roofingMaterial-${w.id}`} title="หลังคา" description="Roofing" />
                        <select id={`roofingMaterial-${w.id}`} value={w.roofingMaterial} onChange={(e) => onUpdate(w.id, 'roofingMaterial', e.target.value)} className={getInputClassName(false)}>
                            {structureOptions.roofing.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor={`wallingMaterial-${w.id}`} title="ผนัง" description="Walling" />
                        <select id={`wallingMaterial-${w.id}`} value={w.wallingMaterial} onChange={(e) => onUpdate(w.id, 'wallingMaterial', e.target.value)} className={getInputClassName(false)}>
                            {structureOptions.walling.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor={`flooringDetails-${w.id}`} title="พื้น" description="Flooring" />
                        <select id={`flooringDetails-${w.id}`} value={w.flooringDetails} onChange={(e) => onUpdate(w.id, 'flooringDetails', e.target.value)} className={getInputClassName(false)}>
                            {structureOptions.flooring.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor={`doorType-${w.id}`} title="ประตู" description="Doors" />
                        <select id={`doorType-${w.id}`} value={w.doorType} onChange={(e) => onUpdate(w.id, 'doorType', e.target.value)} className={getInputClassName(false)}>
                            {structureOptions.doors.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor={`weatherSystems-${w.id}`} title="ระบบกันสภาพอากาศ" description="Weather Protection" />
                        <select id={`weatherSystems-${w.id}`} value={w.weatherSystems} onChange={(e) => onUpdate(w.id, 'weatherSystems', e.target.value)} className={getInputClassName(false)}>
                            {structureOptions.weatherProtection.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor={`optionalSystems-${w.id}`} title="ระบบอื่นๆ เสริม" description="Optional Systems" />
                        <select id={`optionalSystems-${w.id}`} value={w.optionalSystems} onChange={(e) => onUpdate(w.id, 'optionalSystems', e.target.value)} className={getInputClassName(false)}>
                            {structureOptions.optionalSystems.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
            </div>
          </Section>

          <Section title="4. ระบบสาธารณูปโภค (Utilities)">
            <div>
              <Label htmlFor={`electricity-${w.id}`} title="ไฟฟ้า (KVA)" description="Electricity (KVA)" />
              <input id={`electricity-${w.id}`} type="text" value={w.electricity} onChange={(e) => onUpdate(w.id, 'electricity', e.target.value)} placeholder="315" className={getInputClassName(false)} />
            </div>
             <div>
                <Label htmlFor={`waterSupply-${w.id}`} title="ระบบน้ำประปา" description="Water Supply" />
                <input id={`waterSupply-${w.id}`} type="text" value={w.waterSupply} onChange={(e) => onUpdate(w.id, 'waterSupply', e.target.value)} placeholder="เพียงพอ, ประปาส่วนภูมิภาค" className={getInputClassName(false)} />
            </div>
             <div>
                <Label htmlFor={`wasteManagement-${w.id}`} title="การจัดการน้ำเสีย" description="Waste Management" />
                <input id={`wasteManagement-${w.id}`} type="text" value={w.wasteManagement} onChange={(e) => onUpdate(w.id, 'wasteManagement', e.target.value)} placeholder="มีบ่อบำบัด" className={getInputClassName(false)} />
            </div>
            <div>
              <Label htmlFor={`fiberOptic-${w.id}`} title="Fiber Optic" description="อินเทอร์เน็ตความเร็วสูง" />
              <select id={`fiberOptic-${w.id}`} value={w.hasFiberOptic} onChange={(e) => onUpdate(w.id, 'hasFiberOptic', e.target.value)} className={getInputClassName(false)}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
          </Section>

          <Section title="5. ระบบความปลอดภัยและสิ่งอำนวยความสะดวก (Safety & Facilities)">
            <div>
              <Label htmlFor={`security-${w.id}`} title="รปภ. 24 ชม." description="24h Security" />
              <select id={`security-${w.id}`} value={w.hasSecurity} onChange={(e) => onUpdate(w.id, 'hasSecurity', e.target.value)} className={getInputClassName(false)}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
             <div>
              <Label htmlFor={`cctv-${w.id}`} title="CCTV" description="กล้องวงจรปิด" />
              <select id={`cctv-${w.id}`} value={w.cctv} onChange={(e) => onUpdate(w.id, 'cctv', e.target.value)} className={getInputClassName(false)}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <Label htmlFor={`sprinkler-${w.id}`} title="Sprinkler" description="ระบบพ่นน้ำดับเพลิง" />
              <select id={`sprinkler-${w.id}`} value={w.hasSprinkler} onChange={(e) => onUpdate(w.id, 'hasSprinkler', e.target.value)} className={getInputClassName(false)}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
                <Label htmlFor={`fireSafetySystems-${w.id}`} title="ระบบป้องกันอัคคีภัยอื่นๆ" description="Other Fire Safety Systems" />
                <input id={`fireSafetySystems-${w.id}`} type="text" value={w.fireSafetySystems} onChange={(e) => onUpdate(w.id, 'fireSafetySystems', e.target.value)} placeholder="Fire Alarm, Hydrant" className={getInputClassName(false)} />
            </div>
            <div className="lg:col-span-2">
                <Label htmlFor={`parking-${w.id}`} title="ที่จอดรถ" description="Parking" />
                <input id={`parking-${w.id}`} type="text" value={w.parking} onChange={(e) => onUpdate(w.id, 'parking', e.target.value)} placeholder="รถบรรทุก 10, รถยนต์ 20" className={getInputClassName(false)} />
            </div>
            <div className="lg:col-span-2">
                <Label htmlFor={`officeFacilities-${w.id}`} title="สิ่งอำนวยความสะดวกออฟฟิศ" description="Office Facilities" />
                <input id={`officeFacilities-${w.id}`} type="text" value={w.officeFacilities} onChange={(e) => onUpdate(w.id, 'officeFacilities', e.target.value)} placeholder="ห้องประชุม, ห้องน้ำ" className={getInputClassName(false)} />
            </div>
          </Section>

          <Section title="6. การคมนาคมและโลจิสติกส์ (Transport & Logistics)">
             <div>
              <Label htmlFor={`expressway-${w.id}`} title="ใกล้ทางด่วน" description="Near Expressway" />
              <select id={`expressway-${w.id}`} value={w.nearExpressway} onChange={(e) => onUpdate(w.id, 'nearExpressway', e.target.value)} className={getInputClassName(false)}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div className="lg:col-span-2">
                <Label htmlFor={`logisticsProximity-${w.id}`} title="ความใกล้แหล่งโลจิสติกส์" description="Logistics Proximity" />
                <input id={`logisticsProximity-${w.id}`} type="text" value={w.logisticsProximity} onChange={(e) => onUpdate(w.id, 'logisticsProximity', e.target.value)} placeholder="สนามบินสุวรรณภูมิ, ท่าเรือคลองเตย" className={getInputClassName(false)} />
            </div>
             <div>
                <Label htmlFor={`truckAccessRestrictions-${w.id}`} title="ข้อจำกัดรถบรรทุก" description="Truck Access Restrictions" />
                <input id={`truckAccessRestrictions-${w.id}`} type="text" value={w.truckAccessRestrictions} onChange={(e) => onUpdate(w.id, 'truckAccessRestrictions', e.target.value)} placeholder="ไม่มีจำกัดเวลา" className={getInputClassName(false)} />
            </div>
          </Section>

          <Section title="7. ศักยภาพและความเสี่ยง (Potential & Risks)">
             <div>
              <Label htmlFor={`purpleZone-${w.id}`} title="พื้นที่สีม่วง" description="Purple Zone" />
              <select id={`purpleZone-${w.id}`} value={w.isPurpleZone} onChange={(e) => onUpdate(w.id, 'isPurpleZone', e.target.value)} className={getInputClassName(false)}>{yesNoOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <Label htmlFor={`ror4-${w.id}`} title="ใบอนุญาต รง.4" description="Factory License (Ror.4)" />
              <select id={`ror4-${w.id}`} value={w.hasRor4} onChange={(e) => onUpdate(w.id, 'hasRor4', e.target.value)} className={getInputClassName(false)}>{ror4Options.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <Label htmlFor={`floodRisk-${w.id}`} title="ความเสี่ยงน้ำท่วม" description="Flood Risk" />
              <select id={`floodRisk-${w.id}`} value={w.floodRisk} onChange={(e) => onUpdate(w.id, 'floodRisk', e.target.value)} className={getInputClassName(false)}>{floodRiskOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
             <div>
                <Label htmlFor={`expansionPotential-${w.id}`} title="ศักยภาพขยายพื้นที่" description="Expansion Potential" />
                <input id={`expansionPotential-${w.id}`} type="text" value={w.expansionPotential} onChange={(e) => onUpdate(w.id, 'expansionPotential', e.target.value)} placeholder="สามารถขยายได้ในอนาคต" className={getInputClassName(false)} />
            </div>
          </Section>

          <Section title="8. หมายเหตุ/จุดเด่น (Notes / Highlights)">
            <div className="lg:col-span-4">
               <Label htmlFor={`notes-${w.id}`} title="หมายเหตุ/จุดเด่น" description="Notes / Highlights" />
              <input id={`notes-${w.id}`} type="text" value={w.notes} onChange={(e) => onUpdate(w.id, 'notes', e.target.value)} className={getInputClassName(false)} />
            </div>
          </Section>

          <Section title="9. รูปภาพ (Photos)">
            <div className="lg:col-span-4">
                <Label htmlFor={`photos-${w.id}`} title="อัปโหลดรูปภาพ" description={`Photos (${w.photos.length} / 15)`} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {w.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="flex flex-col gap-2">
                          <div className="relative group">
                              <img src={photo.url} alt={`Warehouse ${w.id} photo ${photoIndex + 1}`} className="w-full h-32 object-cover rounded-md shadow-md" />
                              <button 
                                  onClick={() => handleRemovePhoto(w.id, w.photos, photoIndex)}
                                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-label="Remove photo"
                              >
                                  <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                          </div>
                          <input
                              type="text"
                              placeholder="เพิ่มคำอธิบาย..."
                              value={photo.comment}
                              onChange={(e) => handlePhotoCommentChange(w.id, w.photos, photoIndex, e.target.value)}
                              className={`${getInputClassName(false)} text-sm p-1.5`}
                              aria-label={`Comment for photo ${photoIndex + 1}`}
                           />
                        </div>
                    ))}
                    {w.photos.length < 15 && (
                        <label htmlFor={`photo-upload-${w.id}`} className={`w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-slate-50 transition-colors ${normalBorderStyles}`}>
                             <PlusIcon />
                             <span className="mt-2 text-sm text-slate-600">เพิ่มรูปภาพ</span>
                             <input 
                                id={`photo-upload-${w.id}`} 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handlePhotoUpload(w.id, w.photos, e.target.files)}
                            />
                        </label>
                    )}
                </div>
            </div>
          </Section>
        </div>
      ))}
    </div>
  );
};

export default WarehouseTable;
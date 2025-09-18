import React, { useState, useEffect, useRef } from 'react';
import { Warehouse } from './types';
import Header from './components/Header';
import WarehouseTable from './components/WarehouseTable';

// This declaration is necessary because the XLSX library is loaded from a CDN.
declare const XLSX: any;

const App: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const nextId = useRef(1);

  const createNewWarehouse = (): Warehouse => {
    return {
      id: nextId.current++,
      projectName: '',
      location: '',
      googleMapsLink: '',
      area: '',
      height: '',
      rentPerSqm: '',
      totalPrice: 0,
      depositMonths: '',
      floorLoad: '',
      loadingBays: '',
      hasDockLeveler: 'ไม่ระบุ',
      electricity: '',
      hasFiberOptic: 'ไม่ระบุ',
      hasSecurity: 'ไม่ระบุ',
      hasSprinkler: 'ไม่ระบุ',
      nearExpressway: 'ไม่ระบุ',
      isPurpleZone: 'ไม่ระบุ',
      hasRor4: 'ไม่ระบุ',
      floodRisk: 'ไม่มีข้อมูล',
      notes: '',
    };
  };

  useEffect(() => {
    setWarehouses([createNewWarehouse()]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addWarehouseRow = () => {
    setWarehouses(prev => [...prev, createNewWarehouse()]);
  };

  const updateWarehouse = (id: number, field: keyof Warehouse, value: any) => {
    setWarehouses(prev => 
      prev.map(w => {
        if (w.id !== id) return w;

        const updatedWarehouse = { ...w, [field]: value };
        
        const area = Number(updatedWarehouse.area);
        const rentPerSqm = Number(updatedWarehouse.rentPerSqm);
        if (!isNaN(area) && !isNaN(rentPerSqm)) {
            updatedWarehouse.totalPrice = area * rentPerSqm;
        } else {
            updatedWarehouse.totalPrice = 0;
        }
        
        return updatedWarehouse;
      })
    );
  };
  
  const removeWarehouse = (id: number) => {
      setWarehouses(prev => prev.filter(w => w.id !== id));
  }

  const exportToExcel = () => {
    const headers = [
      'ลำดับ', 'ชื่อโครงการ/เจ้าของ', 'ที่ตั้ง (กม.)', 'ลิงก์ Google Maps', 'พื้นที่ใช้สอย (ตร.ม.)', 'ความสูงโกดัง (ม.)', 
      'ค่าเช่า (บาท/ตร.ม.)', 'ราคารวม (ต่อเดือน)', 'เงินมัดจำ (เดือน)', 'พื้นรับน้ำหนัก (ตัน/ตร.ม.)', 
      'จำนวน Loading Bay', 'มี Dock Leveler', 'ไฟฟ้า (KVA)', 'มี Fiber Optic', 'มี รปภ. 24 ชม.', 
      'มี Sprinkler', 'ใกล้ทางด่วน', 'พื้นที่สีม่วง', 'มีใบอนุญาต รง.4', 'ความเสี่ยงน้ำท่วม', 'หมายเหตุ/จุดเด่น',
    ];

    const dataToExport = warehouses.map((w, index) => ({
      'ลำดับ': index + 1,
      'ชื่อโครงการ/เจ้าของ': w.projectName,
      'ที่ตั้ง (กม.)': w.location,
      'ลิงก์ Google Maps': w.googleMapsLink,
      'พื้นที่ใช้สอย (ตร.ม.)': w.area,
      'ความสูงโกดัง (ม.)': w.height,
      'ค่าเช่า (บาท/ตร.ม.)': w.rentPerSqm,
      'ราคารวม (ต่อเดือน)': w.totalPrice > 0 ? w.totalPrice.toLocaleString('en-US') : '',
      'เงินมัดจำ (เดือน)': w.depositMonths,
      'พื้นรับน้ำหนัก (ตัน/ตร.ม.)': w.floorLoad,
      'จำนวน Loading Bay': w.loadingBays,
      'มี Dock Leveler': w.hasDockLeveler,
      'ไฟฟ้า (KVA)': w.electricity,
      'มี Fiber Optic': w.hasFiberOptic,
      'มี รปภ. 24 ชม.': w.hasSecurity,
      'มี Sprinkler': w.hasSprinkler,
      'ใกล้ทางด่วน': w.nearExpressway,
      'พื้นที่สีม่วง': w.isPurpleZone,
      'มีใบอนุญาต รง.4': w.hasRor4,
      'ความเสี่ยงน้ำท่วม': w.floodRisk,
      'หมายเหตุ/จุดเด่น': w.notes,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport, { header: headers, skipHeader: true });
    // Manually add headers to make sure they are in the correct order
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comparison");
    XLSX.writeFile(wb, "ตารางเปรียบเทียบโกดัง.xlsx");
  };

  return (
    <div className="bg-stone-50 min-h-screen font-sans text-stone-800">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Header onAddWarehouse={addWarehouseRow} onExport={exportToExcel} />
        <div className="mt-8">
            <WarehouseTable warehouses={warehouses} onUpdate={updateWarehouse} onRemove={removeWarehouse}/>
        </div>
      </main>
    </div>
  );
};

export default App;
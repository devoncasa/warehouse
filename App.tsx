import React, { useState, useEffect, useRef } from 'react';
import { Warehouse } from './types';
import Header from './components/Header';
import WarehouseTable from './components/WarehouseTable';
import { ReportView } from './components/ReportView';

// This declaration is necessary because the html2canvas library is loaded from a CDN.
declare const html2canvas: any;

const App: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const nextId = useRef(1);
  const reportRef = useRef<HTMLDivElement>(null);

  const createNewWarehouse = (): Warehouse => {
    return {
      id: nextId.current++,
      // General
      projectName: '',
      location: '',
      googleMapsLink: '',
      area: '',
      usableAreaBreakdown: '',
      buildingType: '',
      height: '',
      // Costs & Lease
      rentPerSqm: '',
      totalPrice: 0,
      depositMonths: '',
      leaseTerms: '',
      hiddenCosts: '',
      // Structure & Specs
      floorLoad: '',
      loadingBays: '',
      hasDockLeveler: 'ไม่ระบุ',
      roofStructure: '',
      // Utilities
      electricity: '',
      waterSupply: '',
      wasteManagement: '',
      hasFiberOptic: 'ไม่ระบุ',
      // Safety & Facilities
      hasSecurity: 'ไม่ระบุ',
      cctv: 'ไม่ระบุ',
      hasSprinkler: 'ไม่ระบุ',
      fireSafetySystems: '',
      parking: '',
      officeFacilities: '',
      // Logistics
      nearExpressway: 'ไม่ระบุ',
      logisticsProximity: '',
      truckAccessRestrictions: '',
      // Potential & Risks
      isPurpleZone: 'ไม่ระบุ',
      hasRor4: 'ไม่ระบุ',
      floodRisk: 'ไม่มีข้อมูล',
      expansionPotential: '',
      // Notes
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

  const exportAsJPEG = () => {
    if (reportRef.current) {
        // Temporarily make body visible for capture if it's offscreen
        document.body.style.overflow = 'visible';
        
        html2canvas(reportRef.current, {
            scale: 2, // Higher scale for better resolution
            useCORS: true,
            logging: false,
            windowWidth: reportRef.current.scrollWidth,
            windowHeight: reportRef.current.scrollHeight
        }).then((canvas: HTMLCanvasElement) => {
            const link = document.createElement('a');
            link.download = 'warehouse_report.jpeg';
            link.href = canvas.toDataURL('image/jpeg', 0.9); // 90% quality
            link.click();
            document.body.style.overflow = 'auto'; // Revert back
        });
    } else {
        console.error("Report element not found for exporting.");
    }
  };


  return (
    <>
      <div className="bg-stone-50 min-h-screen font-sans text-stone-800">
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Header onAddWarehouse={addWarehouseRow} onExport={exportAsJPEG} />
          <div className="mt-8">
              <WarehouseTable warehouses={warehouses} onUpdate={updateWarehouse} onRemove={removeWarehouse}/>
          </div>
        </main>
      </div>
      
      {/* Off-screen component for JPEG export. Sized for a standard document. */}
      <div className="absolute top-0 left-[-9999px] p-4" aria-hidden="true">
        <div className="w-[1200px]">
            <ReportView ref={reportRef} warehouses={warehouses} />
        </div>
      </div>
    </>
  );
};

export default App;
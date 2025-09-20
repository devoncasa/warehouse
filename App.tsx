import React, { useState, useEffect, useRef } from 'react';
import { Warehouse } from './types';
import Header from './components/Header';
import WarehouseTable from './components/WarehouseTable';
import FooterActions from './components/FooterActions';
import { ReportView } from './components/ReportView';
import ImagePreviewModal from './components/ImagePreviewModal';
import html2canvas from 'html2canvas';

const createNewWarehouse = (): Warehouse => ({
  id: Date.now() + Math.random(), // Add random to avoid collision on fast adds
  projectName: '',
  location: '',
  googleMapsLink: '',
  area: '',
  usableAreaBreakdown: '',
  buildingType: '',
  height: '',
  rentPerSqm: '',
  totalPrice: 0,
  depositMonths: '',
  leaseTerms: '',
  hiddenCosts: '',
  floorLoad: '',
  loadingBays: '',
  hasDockLeveler: 'ไม่ระบุ',
  roofStructure: '',
  electricity: '',
  waterSupply: '',
  wasteManagement: '',
  hasFiberOptic: 'ไม่ระบุ',
  hasSecurity: 'ไม่ระบุ',
  cctv: 'ไม่ระบุ',
  hasSprinkler: 'ไม่ระบุ',
  fireSafetySystems: '',
  parking: '',
  officeFacilities: '',
  nearExpressway: 'ไม่ระบุ',
  logisticsProximity: '',
  truckAccessRestrictions: '',
  isPurpleZone: 'ไม่ระบุ',
  hasRor4: 'ไม่ระบุ',
  floodRisk: 'ไม่มีข้อมูล',
  expansionPotential: '',
  photos: [],
  notes: '',
});

// Basic check for mobile user agent
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const App: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([createNewWarehouse()]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [reportFilename, setReportFilename] = useState('warehouse_report.jpeg');
  const reportRef = useRef<HTMLDivElement>(null);

  // Recalculate total price when area or rentPerSqm changes
  useEffect(() => {
    setWarehouses(currentWarehouses =>
      currentWarehouses.map(w => {
        const area = Number(w.area) || 0;
        const rent = Number(w.rentPerSqm) || 0;
        const newTotalPrice = area * rent;
        if (w.totalPrice !== newTotalPrice) {
          return { ...w, totalPrice: newTotalPrice };
        }
        return w;
      })
    );
  }, [warehouses]);

  const handleAddWarehouse = () => {
    setWarehouses(prev => [...prev, createNewWarehouse()]);
  };

  const handleUpdateWarehouse = (id: number, field: keyof Warehouse, value: any) => {
    setWarehouses(prev =>
      prev.map(w => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const handleRemoveWarehouse = (id: number) => {
    if (warehouses.length > 1) {
      setWarehouses(prev => prev.filter(w => w.id !== id));
    } else {
      alert("ไม่สามารถลบโกดังสุดท้ายได้ กรุณากรอกข้อมูลหรือเพิ่มโกดังใหม่ก่อนลบ");
    }
  };
  
  const exportAsJPEG = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    const firstWarehouse = warehouses[0];
    let filename = 'warehouse_report';

    if (firstWarehouse) {
        const parts = [
            firstWarehouse.projectName,
            firstWarehouse.location,
            firstWarehouse.area ? `${firstWarehouse.area}sqm` : '',
            firstWarehouse.rentPerSqm ? `${firstWarehouse.rentPerSqm}THBpsqm` : ''
        ].map(p => String(p).trim()).filter(Boolean);

        if (parts.length > 0) {
            filename = parts.join('-')
              .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove invalid chars
              .replace(/\s+/g, '-') // Replace spaces with hyphens
              .replace(/-+/g, '-'); // Collapse multiple hyphens
        }
    }
    
    if (!filename) {
        filename = 'warehouse_report';
    }

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc', // Match body bg color
      });
      
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);

      if (isMobile) {
        setReportFilename(`${filename}.jpeg`);
        setPreviewImage(imageUrl);
      } else {
        const link = document.createElement('a');
        link.download = `${filename}.jpeg`;
        link.href = imageUrl;
        link.click();
      }

    } catch (error) {
      console.error("Error exporting report:", error);
      alert("เกิดข้อผิดพลาดขณะสร้างรูปภาพ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        <main className="mt-8 mb-32">
          <WarehouseTable
            warehouses={warehouses}
            onUpdate={handleUpdateWarehouse}
            onRemove={handleRemoveWarehouse}
          />
        </main>
      </div>
      <FooterActions
        onAddWarehouse={handleAddWarehouse}
        onExport={exportAsJPEG}
        isGenerating={isGenerating}
      />

      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
        filename={reportFilename}
      />
      
      {/* Hidden report view for rendering to canvas */}
      <div className="absolute -left-[9999px] top-0 w-[1440px] bg-slate-50">
        <ReportView ref={reportRef} warehouses={warehouses} />
      </div>
    </>
  );
};

export default App;
import React, { forwardRef } from 'react';
import { Warehouse } from '../types';

const ReportItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => {
    const isMeaningful = value !== null && value !== undefined && value !== '' && value !== 0;
    
    if (!isMeaningful || (typeof value === 'string' && (value === 'ไม่ระบุ' || value === 'ไม่มีข้อมูล'))) {
        return null;
    }

    return (
        <div className="break-inside-avoid">
            <p className="text-base font-medium text-slate-500">{label}</p>
            <p className="text-lg font-semibold text-slate-800 break-words">{value}</p>
        </div>
    );
};

const InfoGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 break-inside-avoid">
        <h4 className="text-xl font-bold text-slate-600 border-b border-slate-200 pb-1 mb-3">{title}</h4>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

interface ReportColumnProps {
  warehouse: Warehouse;
}

const ReportColumnGeneral: React.FC<ReportColumnProps> = ({ warehouse: w }) => (
  <div className="space-y-8">
    <InfoGroup title="General Information">
      <ReportItem label="Location" value={w.location} />
      <ReportItem label="Google Maps Link" value={w.googleMapsLink ? <a href={w.googleMapsLink} className="text-blue-600 underline break-all" target="_blank" rel="noopener noreferrer">{w.googleMapsLink}</a> : null} />
      <ReportItem label="Usable Area (sqm)" value={w.area?.toLocaleString('en-US')} />
      <ReportItem label="Area Breakdown" value={w.usableAreaBreakdown} />
      <ReportItem label="Building Type" value={w.buildingType} />
      <ReportItem label="Clear Height (m)" value={w.height} />
    </InfoGroup>
    <InfoGroup title="Costs & Lease">
      <ReportItem label="Rental Rate (THB/sqm)" value={w.rentPerSqm?.toLocaleString('en-US')} />
      <ReportItem label="Total Price (per month)" value={w.totalPrice?.toLocaleString('en-US', { style: 'currency', currency: 'THB' })} />
      <ReportItem label="Deposit (months)" value={w.depositMonths} />
      <ReportItem label="Lease Terms" value={w.leaseTerms} />
      <ReportItem label="Hidden Costs" value={w.hiddenCosts} />
    </InfoGroup>
  </div>
);

const ReportColumnStructure: React.FC<ReportColumnProps> = ({ warehouse: w }) => (
  <div className="space-y-8">
    <InfoGroup title="Structure & Specs">
      <ReportItem label="Floor Load (ton/sqm)" value={w.floorLoad} />
      <ReportItem label="Loading Bays" value={w.loadingBays} />
      <ReportItem label="Dock Leveler" value={w.hasDockLeveler} />
      <ReportItem label="Column" value={w.columnType} />
      <ReportItem label="Roof Frame" value={w.roofFrameType} />
      <ReportItem label="Roofing" value={w.roofingMaterial} />
      <ReportItem label="Walling" value={w.wallingMaterial} />
      <ReportItem label="Flooring" value={w.flooringDetails} />
      <ReportItem label="Doors" value={w.doorType} />
      <ReportItem label="Weather Protection" value={w.weatherSystems} />
      <ReportItem label="Optional Systems" value={w.optionalSystems} />
    </InfoGroup>
    <InfoGroup title="Transport & Logistics">
      <ReportItem label="Near Expressway" value={w.nearExpressway} />
      <ReportItem label="Logistics Proximity" value={w.logisticsProximity} />
      <ReportItem label="Truck Access Restrictions" value={w.truckAccessRestrictions} />
    </InfoGroup>
  </div>
);

const ReportColumnFacilities: React.FC<ReportColumnProps> = ({ warehouse: w }) => (
  <div className="space-y-8">
    <InfoGroup title="Utilities">
      <ReportItem label="Electricity (KVA)" value={w.electricity} />
      <ReportItem label="Water Supply" value={w.waterSupply} />
      <ReportItem label="Waste Management" value={w.wasteManagement} />
      <ReportItem label="Fiber Optic" value={w.hasFiberOptic} />
    </InfoGroup>
    <InfoGroup title="Safety & Facilities">
      <ReportItem label="24h Security" value={w.hasSecurity} />
      <ReportItem label="CCTV" value={w.cctv} />
      <ReportItem label="Sprinkler" value={w.hasSprinkler} />
      <ReportItem label="Other Fire Safety" value={w.fireSafetySystems} />
      <ReportItem label="Parking" value={w.parking} />
      <ReportItem label="Office Facilities" value={w.officeFacilities} />
    </InfoGroup>
    <InfoGroup title="Potential & Risks">
      <ReportItem label="Purple Zone" value={w.isPurpleZone} />
      <ReportItem label="Factory License (Ror.4)" value={w.hasRor4} />
      <ReportItem label="Flood Risk" value={w.floodRisk} />
      <ReportItem label="Expansion Potential" value={w.expansionPotential} />
    </InfoGroup>
  </div>
);

interface ReportViewProps {
  warehouses: Warehouse[];
}

export const ReportView = forwardRef<HTMLDivElement, ReportViewProps>(({ warehouses }, ref) => {
  const generationTimestamp = new Date().toLocaleString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', '');


  return (
    <div ref={ref} className="bg-slate-50 p-12 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-bold text-slate-900">Warehouse Comparison Report</h1>
        <p className="text-xl text-slate-500 mt-2">
          Generated on: {generationTimestamp}
        </p>
      </header>

      <div className="space-y-12">
        {warehouses.map((w, index) => (
          <div key={w.id} className="bg-white p-8 rounded-xl shadow-lg page-break-inside-avoid">
            <div className="mb-8 border-b-2 border-slate-100 pb-5">
                <h2 className="text-4xl font-bold text-blue-800">
                    {w.projectName || `Warehouse Option #${index + 1}`}
                </h2>
                {w.projectName && <p className="text-xl text-slate-500 mt-1">Warehouse Option #{index + 1}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">
              <ReportColumnGeneral warehouse={w} />
              <ReportColumnStructure warehouse={w} />
              <ReportColumnFacilities warehouse={w} />
            </div>

            {w.notes && (
               <div className="mt-10 pt-6 border-t-2 border-slate-100">
                <InfoGroup title="Notes / Highlights">
                    <p className="text-lg text-slate-700 whitespace-pre-wrap">{w.notes}</p>
                </InfoGroup>
              </div>
            )}
            
            {w.photos && w.photos.length > 0 && (
              <div className="mt-10 pt-6 border-t-2 border-slate-100 page-break-before-auto">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {w.photos.map((photo, photoIndex) => (
                    <div key={photoIndex} className="break-inside-avoid">
                      <img 
                        src={photo.url} 
                        alt={`Warehouse ${w.id} photo ${photoIndex + 1}`} 
                        className="w-full h-auto object-cover rounded-lg shadow-md" 
                      />
                      {photo.comment && (
                        <p className="mt-2 text-base text-slate-700 text-center break-words">{photo.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
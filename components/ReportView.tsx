import React, { forwardRef } from 'react';
import { Warehouse } from '../types';

interface ReportViewProps {
  warehouses: Warehouse[];
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 page-break-inside-avoid">
        <h3 className="text-lg font-semibold text-stone-700 mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-base">
            {children}
        </div>
    </div>
);


const ReportItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => {
    // Do not render the item if value is null, undefined, an empty string, or 0 for certain numeric fields
    const isMeaningful = value !== null && value !== undefined && value !== '' && value !== 0;
    
    if (!isMeaningful || (typeof value === 'string' && (value === 'ไม่ระบุ' || value === 'ไม่มีข้อมูล'))) {
        return null;
    }

    return (
        <div className="grid grid-cols-3 gap-2 py-1 border-t border-stone-100">
            <span className="font-medium text-stone-600 col-span-1">{label}:</span>
            <span className="text-stone-800 col-span-2">{value}</span>
        </div>
    );
};


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
    <div ref={ref} className="bg-stone-50 p-12 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-stone-900">Warehouse Comparison Report</h1>
        <p className="text-lg text-stone-500 mt-2">
          Generated on: {generationTimestamp}
        </p>
      </header>

      <div className="space-y-12">
        {warehouses.map((w, index) => (
          <div key={w.id} className="bg-white p-8 rounded-xl shadow-lg page-break-inside-avoid">
            <h2 className="text-3xl font-bold text-teal-800 mb-6 border-b-2 border-teal-100 pb-3">
              Warehouse Option #{index + 1}
            </h2>
            
            <ReportSection title="General Information">
                <ReportItem label="Project Name / Owner" value={w.projectName} />
                <ReportItem label="Location" value={w.location} />
                <ReportItem label="Google Maps Link" value={w.googleMapsLink ? <a href={w.googleMapsLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View Link</a> : null} />
                <ReportItem label="Usable Area (sqm)" value={w.area?.toLocaleString('en-US')} />
                <ReportItem label="Area Breakdown" value={w.usableAreaBreakdown} />
                <ReportItem label="Building Type" value={w.buildingType} />
                <ReportItem label="Clear Height (m)" value={w.height} />
            </ReportSection>
            
            <ReportSection title="Costs & Lease">
                <ReportItem label="Rental Rate (THB/sqm)" value={w.rentPerSqm?.toLocaleString('en-US')} />
                <ReportItem label="Total Price (per month)" value={w.totalPrice?.toLocaleString('en-US', { style: 'currency', currency: 'THB' })} />
                <ReportItem label="Deposit (months)" value={w.depositMonths} />
                <ReportItem label="Lease Terms" value={w.leaseTerms} />
                <ReportItem label="Hidden Costs" value={w.hiddenCosts} />
            </ReportSection>
            
            <ReportSection title="Structure & Specs">
                <ReportItem label="Floor Load (ton/sqm)" value={w.floorLoad} />
                <ReportItem label="Loading Bays" value={w.loadingBays} />
                <ReportItem label="Dock Leveler" value={w.hasDockLeveler} />
                <ReportItem label="Roof Structure" value={w.roofStructure} />
            </ReportSection>
            
            <ReportSection title="Utilities">
                <ReportItem label="Electricity (KVA)" value={w.electricity} />
                <ReportItem label="Water Supply" value={w.waterSupply} />
                <ReportItem label="Waste Management" value={w.wasteManagement} />
                <ReportItem label="Fiber Optic" value={w.hasFiberOptic} />
            </ReportSection>
            
            <ReportSection title="Safety & Facilities">
                <ReportItem label="24h Security" value={w.hasSecurity} />
                <ReportItem label="CCTV" value={w.cctv} />
                <ReportItem label="Sprinkler" value={w.hasSprinkler} />
                <ReportItem label="Other Fire Safety" value={w.fireSafetySystems} />
                <ReportItem label="Parking" value={w.parking} />
                <ReportItem label="Office Facilities" value={w.officeFacilities} />
            </ReportSection>
            
            <ReportSection title="Transport & Logistics">
                <ReportItem label="Near Expressway" value={w.nearExpressway} />
                <ReportItem label="Logistics Proximity" value={w.logisticsProximity} />
                <ReportItem label="Truck Access Restrictions" value={w.truckAccessRestrictions} />
            </ReportSection>
            
            <ReportSection title="Potential & Risks">
                <ReportItem label="Purple Zone" value={w.isPurpleZone} />
                <ReportItem label="Factory License (Ror.4)" value={w.hasRor4} />
                <ReportItem label="Flood Risk" value={w.floodRisk} />
                <ReportItem label="Expansion Potential" value={w.expansionPotential} />
            </ReportSection>

             <ReportSection title="Notes / Highlights">
                <ReportItem label="Notes" value={w.notes} />
            </ReportSection>
          </div>
        ))}
      </div>
    </div>
  );
});
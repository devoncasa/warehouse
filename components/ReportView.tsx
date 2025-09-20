import React, { forwardRef } from 'react';
import { Warehouse } from '../types';

interface ReportViewProps {
  warehouses: Warehouse[];
}

const ReportItem: React.FC<{ label: string; value: React.ReactNode; fullWidth?: boolean }> = ({ label, value }) => {
    const isMeaningful = value !== null && value !== undefined && value !== '' && value !== 0;
    
    if (!isMeaningful || (typeof value === 'string' && (value === 'ไม่ระบุ' || value === 'ไม่มีข้อมูล'))) {
        return null;
    }

    return (
        <div className="break-inside-avoid">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-base font-semibold text-slate-800 break-words">{value}</p>
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

  const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
      <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">{title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              {children}
          </div>
      </div>
  );

  return (
    <div ref={ref} className="bg-slate-50 p-12 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-slate-900">Warehouse Comparison Report</h1>
        <p className="text-lg text-slate-500 mt-2">
          Generated on: {generationTimestamp}
        </p>
      </header>

      <div className="space-y-10">
        {warehouses.map((w, index) => (
          <div key={w.id} className="bg-white p-6 rounded-xl shadow-lg page-break-inside-avoid">
            <div className="mb-6 border-b-2 border-slate-100 pb-4">
                <h2 className="text-3xl font-bold text-blue-800">
                    {w.projectName || `Warehouse Option #${index + 1}`}
                </h2>
                {w.projectName && <p className="text-lg text-slate-500 mt-1">Warehouse Option #{index + 1}</p>}
            </div>
            
            <div className="space-y-6">
                <Section title="General Information">
                    <ReportItem label="Project Name / Owner" value={w.projectName} />
                    <ReportItem label="Location" value={w.location} />
                    <div className="md:col-span-3">
                      <ReportItem label="Google Maps Link" value={w.googleMapsLink ? <a href={w.googleMapsLink} className="text-blue-600 underline break-all" target="_blank" rel="noopener noreferrer">{w.googleMapsLink}</a> : null} />
                    </div>
                    <ReportItem label="Usable Area (sqm)" value={w.area?.toLocaleString('en-US')} />
                    <ReportItem label="Area Breakdown (Warehouse/Office)" value={w.usableAreaBreakdown} />
                    <ReportItem label="Building Type" value={w.buildingType} />
                    <ReportItem label="Clear Height (m)" value={w.height} />
                </Section>
                
                <Section title="Costs & Lease">
                    <ReportItem label="Rental Rate (THB/sqm)" value={w.rentPerSqm?.toLocaleString('en-US')} />
                    <ReportItem label="Total Price (per month)" value={w.totalPrice?.toLocaleString('en-US', { style: 'currency', currency: 'THB' })} />
                    <ReportItem label="Deposit (months)" value={w.depositMonths} />
                    <div className="md:col-span-3"><ReportItem label="Lease Terms" value={w.leaseTerms} /></div>
                    <div className="md:col-span-3"><ReportItem label="Hidden Costs" value={w.hiddenCosts} /></div>
                </Section>
                
                <Section title="Structure & Specs">
                    <ReportItem label="Floor Load (ton/sqm)" value={w.floorLoad} />
                    <ReportItem label="Loading Bays" value={w.loadingBays} />
                    <ReportItem label="Dock Leveler" value={w.hasDockLeveler} />
                    <ReportItem label="Roof Structure" value={w.roofStructure} />
                </Section>
                
                <Section title="Utilities">
                    <ReportItem label="Electricity (KVA)" value={w.electricity} />
                    <ReportItem label="Water Supply" value={w.waterSupply} />
                    <ReportItem label="Waste Management" value={w.wasteManagement} />
                    <ReportItem label="Fiber Optic" value={w.hasFiberOptic} />
                </Section>
                
                <Section title="Safety & Facilities">
                    <ReportItem label="24h Security" value={w.hasSecurity} />
                    <ReportItem label="CCTV" value={w.cctv} />
                    <ReportItem label="Sprinkler" value={w.hasSprinkler} />
                    <ReportItem label="Other Fire Safety" value={w.fireSafetySystems} />
                    <div className="md:col-span-3"><ReportItem label="Parking" value={w.parking} /></div>
                    <div className="md:col-span-3"><ReportItem label="Office Facilities" value={w.officeFacilities} /></div>
                </Section>
                
                <Section title="Transport & Logistics">
                    <ReportItem label="Near Expressway" value={w.nearExpressway} />
                    <div className="md:col-span-3"><ReportItem label="Logistics Proximity" value={w.logisticsProximity} /></div>
                    <div className="md:col-span-3"><ReportItem label="Truck Access Restrictions" value={w.truckAccessRestrictions} /></div>
                </Section>
                
                <Section title="Potential & Risks">
                    <ReportItem label="Purple Zone" value={w.isPurpleZone} />
                    <ReportItem label="Factory License (Ror.4)" value={w.hasRor4} />
                    <ReportItem label="Flood Risk" value={w.floodRisk} />
                    <div className="md:col-span-3"><ReportItem label="Expansion Potential" value={w.expansionPotential} /></div>
                </Section>

                <Section title="Notes / Highlights">
                    <div className="md:col-span-3"><ReportItem label="Notes" value={w.notes} /></div>
                </Section>

                {w.photos && w.photos.length > 0 && (
                  <Section title="Photos">
                      <div className="md:col-span-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                              {w.photos.map((photo, photoIndex) => (
                                  <div key={photoIndex} className="break-inside-avoid">
                                      <img 
                                          src={photo} 
                                          alt={`Warehouse ${w.id} photo ${photoIndex + 1}`} 
                                          className="w-full h-auto object-cover rounded-lg shadow-md" 
                                      />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </Section>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
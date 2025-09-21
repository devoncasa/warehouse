import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <img src="https://cdn.jsdelivr.net/gh/devoncasa/warehouse@main/warehouse-logo.png" alt="Warehouse Comparison Tool Logo" className="h-16 w-16 object-contain" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">ตารางเปรียบเทียบโกดัง/โรงงาน</h1>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              เงื่อนไข: 7000–9000 ตร.ม. ขึ้นไป / ย่านบางนา (ไม่เกิน กม.36) / ราคาถูกสุด / ใช้เก็บเครื่องกรองน้ำ / Warehouse only
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
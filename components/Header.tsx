import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">ตารางเปรียบเทียบโกดัง/โรงงาน</h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            เงื่อนไข: 7000–7200 ตร.ม. ขึ้นไป / ย่านบางนา (ไม่เกิน กม.36) / ราคาถูกสุด / ใช้เก็บเครื่องกรองน้ำ
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
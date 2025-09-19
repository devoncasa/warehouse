import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface HeaderProps {
  onAddWarehouse: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddWarehouse, onExport }) => {
  return (
    <header>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">ตารางเปรียบเทียบโกดัง/โรงงาน</h1>
          <p className="mt-2 text-base text-stone-600 max-w-2xl">
            เงื่อนไข: 7000–7200 ตร.ม. ขึ้นไป / ย่านบางนา (ไม่เกิน กม.36) / ราคาถูกสุด / ใช้เก็บเครื่องกรองน้ำ
          </p>
        </div>
        <div className="flex-shrink-0 flex gap-2 w-full sm:w-auto">
          <button
            onClick={onAddWarehouse}
            className="w-1/2 sm:w-auto flex items-center justify-center gap-2 bg-stone-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-stone-800 transition-colors duration-200 text-base"
          >
            <PlusIcon />
            เพิ่มโกดัง
          </button>
          <button
            onClick={onExport}
            className="w-1/2 sm:w-auto flex items-center justify-center gap-2 bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-teal-800 transition-colors duration-200 text-base"
          >
            <DownloadIcon />
            บันทึกเป็นรูปภาพ
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
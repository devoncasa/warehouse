import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface FooterActionsProps {
  onAddWarehouse: () => void;
  onExport: () => void;
  isGenerating: boolean;
}

const FooterActions: React.FC<FooterActionsProps> = ({ onAddWarehouse, onExport, isGenerating }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 mt-8 py-4 px-4 flex justify-center items-center gap-4 bg-white/80 backdrop-blur-sm border-t border-slate-200">
      <button
        onClick={onAddWarehouse}
        className="flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-slate-50 transition-colors duration-200 text-lg border border-slate-300"
      >
        <PlusIcon />
        เพิ่มโกดัง
      </button>
      <button
        onClick={onExport}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 text-lg disabled:bg-blue-400 disabled:cursor-wait"
      >
        {isGenerating ? (
            <>
                <SpinnerIcon />
                กำลังสร้าง...
            </>
        ) : (
            <>
                <DownloadIcon />
                บันทึกเป็นรูปภาพ
            </>
        )}
      </button>
    </footer>
  );
};

export default FooterActions;
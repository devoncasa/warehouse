import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-full flex flex-col">
        <header className="p-4 border-b border-stone-200 flex justify-between items-center flex-shrink-0">
            <div>
                <h2 className="text-lg font-semibold text-stone-800">Report Preview</h2>
                <p className="text-sm text-stone-600">แตะค้างที่รูปภาพเพื่อบันทึก (Tap and hold image to save)</p>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                aria-label="Close preview"
            >
                <CloseIcon />
            </button>
        </header>
        <div className="p-4 overflow-auto flex-grow">
          <img 
            src={imageUrl} 
            alt="Warehouse Comparison Report Preview" 
            className="max-w-full h-auto mx-auto"
          />
        </div>
      </div>
    </div>
  );
};
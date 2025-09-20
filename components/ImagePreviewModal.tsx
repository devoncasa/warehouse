import React, { useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  filename: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onClose, imageUrl, filename }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
       document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
       document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="text-center mb-4">
          <p className="text-white text-lg">Tap and hold image to save</p>
          <p className="text-slate-300 text-sm break-all">Recommended filename: <strong className="font-semibold">{filename}</strong></p>
      </div>
      <div
        className="relative bg-white p-2 rounded-lg shadow-2xl max-w-4xl max-h-[80vh] w-full transform transition-transform duration-300 scale-95"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
        style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)' }}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-slate-800 rounded-full p-2 z-10 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Close image preview"
        >
          <CloseIcon />
        </button>
        <div className="overflow-auto max-h-[calc(80vh-1rem)]">
          <img
            src={imageUrl}
            alt="Warehouse Preview"
            className="w-full h-auto object-contain rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
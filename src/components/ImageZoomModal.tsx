import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  fileName?: string;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  fileName,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[90vh] bg-[#0D1117] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col cursor-default"
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
            <ZoomIn className="w-4 h-4 text-[#6742F5]" />
            <span className="truncate max-w-md">{fileName || 'Visual Artifact Inspection'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#07090D]">
          <img
            src={imageUrl}
            alt={fileName || 'Analyzed artifact'}
            className="max-w-full max-h-[75vh] object-contain rounded-lg"
          />
        </div>

        <div className="p-3 border-t border-white/10 text-center text-[11px] text-gray-400">
          Click anywhere outside or press ESC to close.
        </div>
      </div>
    </div>
  );
};

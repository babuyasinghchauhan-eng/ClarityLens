import React from 'react';
import { History, X, Trash2, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { AnalysisHistoryItem } from '../types/clarity';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisHistoryItem[];
  onSelectHistoryItem: (item: AnalysisHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#17151F]/10">
        {/* Header */}
        <div className="p-5 border-b border-[#17151F]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#6742F5]" />
            <h3 className="font-bold text-base text-[#17151F]">Recent Analyses</h3>
            <span className="text-xs bg-[#F0ECFF] text-[#6742F5] px-2 py-0.5 rounded-full font-bold">
              {history.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 text-[#FF8066] hover:bg-[#FFF1EE] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Clear all saved history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#706D7A] hover:bg-[#F7F6FA] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Clock className="w-10 h-10 text-[#706D7A]/30 mx-auto" />
              <p className="text-sm font-semibold text-[#17151F]">No analyses saved yet</p>
              <p className="text-xs text-[#706D7A] max-w-xs mx-auto">
                Analyses performed during your session will appear here for fast one-click review.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="p-3.5 rounded-2xl border border-[#17151F]/10 hover:border-[#6742F5] hover:bg-[#F0ECFF]/30 transition-all cursor-pointer flex gap-3 group"
              >
                <img
                  src={item.thumbnailDataUrl}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover bg-neutral-900/5 shrink-0 border border-[#17151F]/10"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#706D7A]">
                      <span className="font-semibold text-[#6742F5] uppercase tracking-wider">
                        {item.mode.replace('_', ' ')}
                      </span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#17151F] truncate mt-0.5 group-hover:text-[#6742F5]">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#706D7A] line-clamp-1 mt-0.5">
                      {item.result.image_summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#706D7A] pt-1">
                    <span>{item.result.next_steps.length} steps</span>
                    <span className="flex items-center text-[#6742F5] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Restore <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-[#17151F]/10 bg-[#F7F6FA] text-[11px] text-[#706D7A] text-center">
          Analyses are securely preserved in local session storage.
        </div>
      </div>
    </div>
  );
};

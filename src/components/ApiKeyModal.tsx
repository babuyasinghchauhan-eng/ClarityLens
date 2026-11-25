import React, { useState } from 'react';
import { Key, X, Check, AlertCircle, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSaveKey: (key: string) => void;
  hasEnvKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
  hasEnvKey,
}) => {
  const [keyValue, setKeyValue] = useState<string>(currentKey);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(keyValue.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setKeyValue('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#17151F]/10">
        <div className="p-5 border-b border-[#17151F]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#6742F5]" />
            <h3 className="font-bold text-base text-[#17151F]">API Key Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#706D7A] hover:bg-[#F7F6FA] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#17151F] uppercase tracking-wide">
              Google Gen AI / Gemini API Key
            </label>
            <p className="text-xs text-[#706D7A]">
              Used to query Gemma 4 and multimodal fallback models.
            </p>
          </div>

          {hasEnvKey ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">Server Environment Key Detected:</span>
                <p className="mt-0.5">
                  A default <code className="font-mono font-medium">GEMINI_API_KEY</code> is loaded on the server. You only need to enter a custom key below if you wish to override it.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">No Server Key Detected:</span>
                <p className="mt-0.5">
                  Enter your Google Gen AI API key to enable live Gemma 4 inference. If left empty, pre-seeded sample demonstrations will still run.
                </p>
              </div>
            </div>
          )}

          <input
            type="password"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#17151F]/15 focus:outline-none focus:ring-2 focus:ring-[#6742F5] bg-[#F7F6FA] font-mono"
          />

          <div className="text-[11px] text-[#706D7A] flex items-center justify-between">
            <span>Keys are stored strictly in client memory/localStorage.</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6742F5] hover:underline font-semibold"
            >
              Get a Gemini API Key →
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-[#17151F]/10 bg-[#F7F6FA] flex items-center justify-between">
          {keyValue && (
            <button
              onClick={handleClear}
              className="text-xs text-[#FF8066] hover:underline font-semibold cursor-pointer"
            >
              Clear Custom Key
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#706D7A] hover:text-[#17151F] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-[#6742F5] hover:bg-[#3921A8] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

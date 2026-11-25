import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string, mimeType: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Unable to access device camera. Please check permissions.');
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    onCapture(dataUrl, 'image/jpeg');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#17151F]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#6742F5]" />
            <h3 className="font-bold text-base text-[#17151F]">Capture Image with Camera</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#706D7A] hover:bg-[#F7F6FA] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video stream container */}
        <div className="relative bg-[#0D1117] min-h-[360px] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-3 text-white max-w-sm">
              <AlertCircle className="w-10 h-10 text-[#FF8066] mx-auto" />
              <p className="text-sm font-semibold">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-[#6742F5] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full max-h-[500px] object-cover"
              />
              {isInitializing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white gap-2 text-xs font-semibold">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#6742F5]" />
                  <span>Starting camera stream...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 sm:p-5 border-t border-[#17151F]/10 flex items-center justify-between bg-[#F7F6FA]">
          <span className="text-xs text-[#706D7A]">
            Ensure handwriting or text is well-lit and in focus.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#706D7A] hover:text-[#17151F] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSnap}
              disabled={!!cameraError || isInitializing}
              className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                cameraError || isInitializing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#6742F5] hover:bg-[#3921A8]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Capture Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

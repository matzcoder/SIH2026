import React, { useRef, useState } from 'react';

export default function CameraViewfinder({ onCapture, onClose }) {
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err) {
      console.warn('Live webcam access denied or unavailable:', err);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob && onCapture) {
        onCapture(blob);
      }
      stopCamera();
    }, 'image/jpeg');
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    if (onClose) onClose();
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-300 aspect-video flex items-center justify-center shadow-inner">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${streamActive ? 'block' : 'hidden'}`}
      />

      {!streamActive && (
        <div className="text-center p-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center text-2xl shadow-sm">
            📷
          </div>
          <p className="text-xs text-slate-500 font-medium">Position commodity packaging label within view</p>
          <button
            type="button"
            onClick={startCamera}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow transition-all"
          >
            Start Camera
          </button>
        </div>
      )}

      {streamActive && (
        <>
          <div className="absolute inset-8 border-2 border-dashed border-blue-500/70 rounded-xl pointer-events-none flex items-center justify-center">
            <span className="text-[10px] bg-white/90 px-2.5 py-0.5 rounded-full text-blue-700 font-bold shadow-sm">
              Align Label Here
            </span>
          </div>

          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={takeSnapshot}
              className="w-12 h-12 rounded-full bg-white border-4 border-blue-600 shadow-xl hover:scale-105 active:scale-95 transition-transform"
              title="Capture photo"
            />
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}

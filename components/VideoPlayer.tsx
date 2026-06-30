'use client';

import { useRef, useState } from 'react';

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      const currentlyMuted = videoRef.current.muted;
      videoRef.current.muted = !currentlyMuted;
      setIsMuted(!currentlyMuted);
      
      if (currentlyMuted) {
        // Al quitarle el mute, lo reiniciamos para que escuche todo desde el principio
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-[var(--brand-700)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[6px] border-white ring-1 ring-[var(--border)] group cursor-pointer" onClick={toggleMute}>
      <video
        ref={videoRef}
        src="/certificado-demo.mp4"
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Botón central animado para incitar al clic si está muteado */}
      {isMuted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-xl ring-4 ring-white/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            </div>
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-md">
              TOCA PARA ESCUCHAR
            </span>
          </div>
        </div>
      )}

      {/* Indicador de sonido en la esquina */}
      <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/50 p-2 backdrop-blur-md transition-opacity group-hover:bg-black/70">
        {isMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </div>

      {/* Gradiente sutil encima del video */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}

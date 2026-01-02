
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HandGestureData, SectorType } from '../types';
import { COSMIC_SECTORS } from '../constants';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  gesture: HandGestureData | null;
  selectedBody: string | null;
  insight: any | null;
  isLoading: boolean;
  activeSector: SectorType;
  onSectorChange: (id: SectorType) => void;
  isTransiting: boolean;
}

const HandHUD: React.FC<Props> = ({ 
  videoRef, 
  gesture, 
  selectedBody, 
  insight, 
  isLoading, 
  activeSector, 
  onSectorChange,
  isTransiting
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      {/* Top Header & Sector Selector */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4">
          <div className="bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-xl pointer-events-auto">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              COSMOS HAND-EXPLORER
            </h1>
            <p className="text-xs text-white/50 tracking-widest uppercase">Navigation System v4.0</p>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            {COSMIC_SECTORS.map((sector) => (
              <button
                key={sector.id}
                onClick={() => onSectorChange(sector.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-mono border transition-all ${
                  activeSector === sector.id 
                  ? 'bg-blue-500/20 border-blue-400 text-blue-400' 
                  : 'bg-black/40 border-white/10 text-white/40 hover:border-white/30'
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-48 h-36 border-2 border-blue-500/30 rounded-lg overflow-hidden bg-black/40">
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-x-[-1]"
            autoPlay
            muted
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className={`w-6 h-6 border-2 rounded-full transition-all duration-300 ${gesture ? 'border-blue-400 scale-110 opacity-100' : 'border-white/10 scale-100 opacity-50'}`} />
          </div>
          <p className="absolute bottom-1 right-2 text-[8px] text-blue-400 font-mono">LIVE_FEED_ACTV</p>
        </div>
      </div>

      {/* Middle Context - Warp/Gesture Status */}
      <div className="flex flex-col items-center">
        {isTransiting ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-1 h-32 bg-gradient-to-t from-transparent via-blue-500 to-transparent animate-pulse" />
            <span className="text-blue-400 font-mono text-xl tracking-[0.5em] mt-4 animate-pulse">WARP SPEED</span>
          </motion.div>
        ) : gesture && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-md border px-8 py-3 rounded-full mb-4 flex items-center gap-6 transition-colors duration-300 ${gesture.isPinching ? 'bg-blue-500/20 border-blue-400' : 'bg-black/40 border-white/10'}`}
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-mono">Status</span>
              <span className={`text-sm font-bold transition-colors ${gesture.isPinching ? 'text-blue-400' : 'text-purple-400'}`}>
                {gesture.isPinching ? 'PINCH ACTIVE' : gesture.isOpenHand ? 'HAND OPEN' : 'TRACKING'}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-mono">Action</span>
              <span className="text-sm font-bold text-white">
                {gesture.isPinching ? 'ZOOM CONTROL' : gesture.isOpenHand ? 'ORBIT MODE' : 'READY'}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom - Gemini Insight */}
      <div className="flex justify-end items-end">
        <AnimatePresence>
          {selectedBody && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-96 bg-black/70 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedBody}</h2>
                <div className="px-2 py-1 bg-blue-500/20 rounded border border-blue-500/50 text-[10px] text-blue-400 font-mono">
                  ASTRO_AI
                </div>
              </div>
              
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 animate-pulse rounded w-full" />
                  <div className="h-4 bg-white/10 animate-pulse rounded w-4/5" />
                </div>
              ) : insight ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-300 italic">"{insight.content}"</p>
                  <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-3 rounded-lg border border-blue-500/30">
                    <p className="text-[10px] text-blue-300 font-bold uppercase mb-1">Observation</p>
                    <p className="text-xs text-white">{insight.fact}</p>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Legend */}
      <div className="absolute left-6 bottom-6 space-y-3 bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-3 text-white/60 text-[10px] font-mono">
          <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center bg-white/5">👋</div>
          <span>Open Hand: Rotate Universe</span>
        </div>
        <div className="flex items-center gap-3 text-white/60 text-[10px] font-mono">
          <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center bg-white/5">🤏</div>
          <span>Pinch: Zoom Depth</span>
        </div>
      </div>
    </div>
  );
};

export default HandHUD;

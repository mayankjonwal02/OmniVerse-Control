
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import Universe from './components/Universe';
import HandHUD from './components/HandHUD';
import { getCosmicInsight } from './services/geminiService';
import { HandGestureData, SectorType } from './types';
import { COSMIC_SECTORS } from './constants';

declare var Hands: any;
declare var Camera: any;

const App: React.FC = () => {
  const [activeSector, setActiveSector] = useState<SectorType>('solar-system');
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [insight, setInsight] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gesture, setGesture] = useState<HandGestureData | null>(null);
  const [isTransiting, setIsTransiting] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const orbitControlsRef = useRef<any>(null);
  const lastGestureRef = useRef<HandGestureData | null>(null);

  const initHandTracking = useCallback(() => {
    try {
      if (typeof Hands === 'undefined' || typeof Camera === 'undefined') {
        console.warn("MediaPipe libraries not loaded yet.");
        return;
      }

      const hands = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      hands.onResults((results: any) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          const handCenter = landmarks[9];
          const x = handCenter.x;
          const y = handCenter.y;
          const z = handCenter.z;

          const wrist = landmarks[0];
          const handScale = Math.sqrt(
            Math.pow(wrist.x - handCenter.x, 2) + Math.pow(wrist.y - handCenter.y, 2)
          );

          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const pinchDist = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
          );
          const isPinching = pinchDist < handScale * 0.45;

          const tips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
          const avgTipDist = tips.reduce((sum, tip) => sum + Math.sqrt(
            Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2)
          ), 0) / 4;
          const isOpenHand = avgTipDist > handScale * 1.5;

          const currentGesture: HandGestureData = { x, y, z, pinchDistance: pinchDist, isPinching, isOpenHand };
          setGesture(currentGesture);

          if (orbitControlsRef.current && !isTransiting) {
            const controls = orbitControlsRef.current;
            const cam = controls.object;
            const target = controls.target;
            const last = lastGestureRef.current;

            if (last) {
              const rotateSpeed = 6;
              const zoomSpeed = 150;
              const dx = x - last.x;
              const dy = y - last.y;

              if (isPinching) {
                const offset = new THREE.Vector3().subVectors(cam.position, target);
                const dist = offset.length();
                const newDist = Math.max(5, Math.min(400, dist + (dy * zoomSpeed)));
                offset.normalize().multiplyScalar(newDist);
                cam.position.copy(target).add(offset);
                controls.update();
              } else if (isOpenHand) {
                const offset = new THREE.Vector3().subVectors(cam.position, target);
                const spherical = new THREE.Spherical().setFromVector3(offset);
                spherical.theta -= dx * rotateSpeed;
                spherical.phi -= dy * rotateSpeed;
                spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
                offset.setFromSpherical(spherical);
                cam.position.copy(target).add(offset);
                controls.update();
              }
            }
            lastGestureRef.current = currentGesture;
          }
        } else {
          setGesture(null);
          lastGestureRef.current = null;
        }
      });

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current! });
          },
          width: 640,
          height: 480
        });
        camera.start();
      }
    } catch (err) {
      console.error("Hand tracking initialization failed:", err);
    }
  }, [isTransiting]);

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const script = document.createElement('script');
        script.src = src; script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"),
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js")
    ]).then(() => {
      if (videoRef.current) initHandTracking();
    }).catch(err => {
      setInitError("Critical libraries failed to load. Please check your internet connection.");
      console.error(err);
    });
  }, [initHandTracking]);

  const handleSectorChange = useCallback(async (id: SectorType) => {
    if (id === activeSector) return;
    
    setIsTransiting(true);
    setSelectedBody(null);
    setInsight(null);

    setTimeout(async () => {
      setActiveSector(id);
      setIsTransiting(false);
      
      const sector = COSMIC_SECTORS.find(s => s.id === id);
      if (sector) {
        setSelectedBody(sector.name);
        setIsLoading(true);
        const data = await getCosmicInsight(sector.name);
        setInsight(data);
        setIsLoading(false);
      }
    }, 1500);
  }, [activeSector]);

  const handleSelectBody = useCallback(async (name: string) => {
    setSelectedBody(name);
    setIsLoading(true);
    try {
      const data = await getCosmicInsight(name);
      setInsight(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (initError) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-red-500 font-mono p-10 text-center">
        <div>
          <h1 className="text-3xl mb-4 font-bold">SYSTEM ERROR</h1>
          <p>{initError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 border border-red-500 hover:bg-red-500/20 rounded-full transition-all"
          >
            REBOOT SYSTEM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      <div className="absolute inset-0">
        <Universe 
          onSelect={handleSelectBody} 
          controlRef={orbitControlsRef} 
          activeSector={activeSector}
        />
      </div>

      <HandHUD 
        videoRef={videoRef} 
        gesture={gesture} 
        selectedBody={selectedBody} 
        insight={insight} 
        isLoading={isLoading} 
        activeSector={activeSector}
        onSectorChange={handleSectorChange}
        isTransiting={isTransiting}
      />

      <AnimatePresence>
        {isTransiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px]" />
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ top: '50%', left: '50%', width: 0, height: 0 }}
                animate={{ 
                  width: '100vw', 
                  height: '2px', 
                  left: (Math.random() - 0.5) * 200 + '%',
                  top: (Math.random() - 0.5) * 200 + '%',
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 0.8, repeat: Infinity, delay: Math.random() }}
                className="absolute bg-white"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;


import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import CelestialObject from './CelestialObject';
import Galaxy from './Galaxy';
import BlackHole from './BlackHole';
import Nebula from './Nebula';
import { SOLAR_SYSTEM_DATA } from '../constants';
import { SectorType } from '../types';

interface Props {
  onSelect: (name: string) => void;
  controlRef: React.RefObject<any>;
  activeSector: SectorType;
}

const SceneUpdater: React.FC<{ activeSector: SectorType }> = ({ activeSector }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Adjust camera for specific sectors
    if (activeSector === 'universe') {
      camera.position.set(0, 100, 250);
    } else {
      camera.position.set(0, 40, 80);
    }
    camera.lookAt(0, 0, 0);
  }, [activeSector, camera]);

  return null;
};

const Universe: React.FC<Props> = ({ onSelect, controlRef, activeSector }) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 40, 80]} fov={50} />
      <SceneUpdater activeSector={activeSector} />
      
      <color attach="background" args={['#020205']} />
      
      <Stars 
        radius={500} 
        depth={150} 
        count={activeSector === 'universe' ? 50000 : 15000} 
        factor={activeSector === 'black-hole' ? 12 : 6} 
        saturation={0.5} 
        fade 
        speed={0.5} 
      />

      <ambientLight intensity={0.15} />
      
      <Suspense fallback={null}>
        <group>
          {activeSector === 'solar-system' && (
            <>
              {SOLAR_SYSTEM_DATA.map((body) => (
                <CelestialObject key={body.name} body={body} onSelect={onSelect} />
              ))}
              <group position={[0, -20, -150]}>
                <Nebula count={5} spread={400} colors={['#050022', '#110022']} />
              </group>
            </>
          )}
          
          {activeSector === 'andromeda' && (
            <group>
              <Galaxy />
              <Nebula count={15} spread={200} colors={['#4400ff', '#00ffff', '#aa00ff']} />
            </group>
          )}

          {activeSector === 'black-hole' && (
            <group>
              <BlackHole />
              <group scale={1.8}>
                 <Nebula count={20} spread={150} colors={['#ff4400', '#ffaa00', '#220000']} />
              </group>
            </group>
          )}

          {activeSector === 'nebula' && (
            <group>
              {/* Massive, dense nebula field */}
              <Nebula count={60} spread={180} colors={['#ff00ff', '#00ffff', '#ffaa00', '#4400ff']} />
              <Stars radius={200} count={5000} factor={10} />
              <pointLight intensity={2} color="#ff00ff" position={[50, 50, 50]} />
              <pointLight intensity={2} color="#00ffff" position={[-50, -50, -50]} />
            </group>
          )}

          {activeSector === 'universe' && (
            <group>
              {/* Grand scale view with multiple distant galaxies */}
              <group position={[0, 0, 0]} scale={0.5}><Galaxy /></group>
              <group position={[200, 100, -300]} scale={0.3} rotation={[1, 0, 0.5]}><Galaxy /></group>
              <group position={[-250, -50, -150]} scale={0.2} rotation={[0, 1, 0.2]}><Galaxy /></group>
              <group position={[100, -150, -400]} scale={0.4} rotation={[0.5, 0.5, 1]}><Galaxy /></group>
              <group position={[-150, 150, -250]} scale={0.25} rotation={[0, 0, 2]}><Galaxy /></group>
              
              <Nebula count={30} spread={800} colors={['#050510', '#100515']} />
            </group>
          )}
        </group>
      </Suspense>

      <OrbitControls 
        ref={controlRef}
        enableDamping 
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={1.2}
        minDistance={5}
        maxDistance={800}
      />
      
      <Environment preset="night" />
    </Canvas>
  );
};

export default Universe;

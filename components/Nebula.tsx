
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

interface NebulaCloudProps {
  position: [number, number, number];
  color: string;
  scale: number;
}

const NebulaCloud: React.FC<NebulaCloudProps> = ({ position, color, scale }) => {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.03} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
        />
      </mesh>
      <mesh position={position} scale={scale * 0.7}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.05} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
        />
      </mesh>
    </Float>
  );
};

interface NebulaProps {
  count?: number;
  spread?: number;
  colors?: string[];
}

const Nebula: React.FC<NebulaProps> = ({ 
  count = 15, 
  spread = 100, 
  colors = ['#4400ff', '#ff00aa', '#00ffff', '#6600ff'] 
}) => {
  const clouds = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.5,
        (Math.random() - 0.5) * spread
      ] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 10 + Math.random() * 30
    }));
  }, [count, spread, colors]);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <NebulaCloud key={i} {...cloud} />
      ))}
    </group>
  );
};

export default Nebula;

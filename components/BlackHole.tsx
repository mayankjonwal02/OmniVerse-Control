
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

const BlackHole: React.FC = () => {
  const diskRef = useRef<THREE.Group>(null);
  const warpedDiskRef = useRef<THREE.Group>(null);

  // Generate dense rings of particles for a "streaky" high-velocity gas look
  const particleCount = 8000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Create concentric-ish rings with noise
      const ringIndex = Math.floor(Math.random() * 5);
      const baseRadius = 12 + ringIndex * 5 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      
      const x = Math.cos(angle) * baseRadius;
      const z = Math.sin(angle) * baseRadius;
      const y = (Math.random() - 0.5) * 1.2; // Thin disk
      
      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (diskRef.current) diskRef.current.rotation.y = t * 0.3;
    if (warpedDiskRef.current) warpedDiskRef.current.rotation.y = -t * 0.1;
  });

  return (
    <group>
      {/* 1. THE SINGULARITY (Event Horizon) */}
      <mesh>
        <sphereGeometry args={[10, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. PHOTON SPHERE (The blindingly bright ring at the edge of the shadow) */}
      <mesh scale={1.01}>
        <ringGeometry args={[10, 10.5, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. MAIN ACCRETION DISK (Horizontal Layer) */}
      <group ref={diskRef}>
        {/* Glow behind the disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[11, 45, 128]} />
          <meshBasicMaterial 
            color="#ff4400" 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Detailed High-Velocity Particles */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial 
            size={0.12} 
            color="#ffaa44" 
            transparent 
            opacity={0.6} 
            blending={THREE.AdditiveBlending} 
            sizeAttenuation={true}
          />
        </points>

        {/* Dense Inner Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[11, 15, 128]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.4} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 4. GRAVITATIONAL LENSING (Interstellar-style vertical arcs) */}
      <group ref={warpedDiskRef}>
        {/* Top bent part of the disk */}
        <mesh position={[0, 0, 0]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[16, 1.2, 16, 100, Math.PI]} />
          <meshStandardMaterial 
            color="#ff5500" 
            emissive="#ff2200" 
            emissiveIntensity={15} 
            transparent 
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Bottom bent part of the disk */}
        <mesh position={[0, 0, 0]} rotation={[-0.4, 0, Math.PI]}>
          <torusGeometry args={[16, 1.2, 16, 100, Math.PI]} />
          <meshStandardMaterial 
            color="#ff3300" 
            emissive="#ff1100" 
            emissiveIntensity={8} 
            transparent 
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Central Lensing Distortion Circle (Simulates light bending around the sphere) */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[11.5, 0.4, 16, 100]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* 5. RELATIVISTIC BEAMING (Brightness boost on the side moving towards observer) */}
      <pointLight 
        position={[25, 0, 10]} 
        intensity={50} 
        distance={120} 
        color="#ffddaa" 
      />
      
      {/* 6. VOLUMETRIC CORONA / HALO */}
      <mesh scale={1.2}>
        <sphereGeometry args={[45, 32, 32]} />
        <meshBasicMaterial 
          color="#ff7700" 
          transparent 
          opacity={0.04} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 7. SCATTERED RADIATED PARTICLES */}
      <Sparkles 
        count={300} 
        scale={100} 
        size={1.5} 
        speed={0.6} 
        color="#ffcc00" 
        opacity={0.3}
      />

      <pointLight intensity={25} distance={600} color="#ff4400" />
      
      {/* Subtle Blue "Edge" light for high-energy contrast */}
      <pointLight position={[-30, 10, -10]} intensity={5} color="#4488ff" />
    </group>
  );
};

export default BlackHole;

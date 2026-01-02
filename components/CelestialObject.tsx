
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBody } from '../types';

interface Props {
  body: CelestialBody;
  onSelect: (name: string) => void;
}

const CelestialObject: React.FC<Props> = ({ body, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  
  // Random start angle
  const startAngle = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (orbitRef.current && body.distance > 0) {
      orbitRef.current.rotation.y = clock.getElapsedTime() * body.speed + startAngle;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Orbit Ring */}
      {body.distance > 0 && (
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[body.distance - 0.05, body.distance + 0.05, 128]} />
          <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
        </mesh>
      )}

      <group ref={orbitRef}>
        <group position={[body.distance, 0, 0]}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere
              ref={meshRef}
              args={[body.radius, 32, 32]}
              onClick={() => onSelect(body.name)}
            >
              <meshStandardMaterial
                color={body.color}
                emissive={body.name === 'Sun' ? body.color : '#000000'}
                emissiveIntensity={body.name === 'Sun' ? 2 : 0}
                metalness={0.4}
                roughness={0.7}
              />
            </Sphere>
            
            <Text
              position={[0, body.radius + 1, 0]}
              fontSize={0.8}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#000000"
            >
              {body.name}
            </Text>

            {body.name === 'Sun' && (
              <pointLight intensity={10} distance={200} decay={1} color="#ffcc33" />
            )}
          </Float>
        </group>
      </group>
    </group>
  );
};

export default CelestialObject;

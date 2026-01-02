
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

const Galaxy: React.FC = () => {
  const count = 5000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 80 + 5;
      const spiral = (radius / 80) * Math.PI * 6;
      const x = Math.cos(angle + spiral) * radius + (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 5;
      const z = Math.sin(angle + spiral) * radius + (Math.random() - 0.5) * 10;
      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, [count]);

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.3} color="#88ccff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </points>
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight intensity={15} distance={200} />
      </mesh>
    </group>
  );
};

export default Galaxy;

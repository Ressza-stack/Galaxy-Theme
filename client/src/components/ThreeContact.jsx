import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function FloatingShape() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.4} />
    </mesh>
  );
}

export default function ThreeContact() {
  return (
    <div style={{ width: '100%', height: '250px', marginTop: '20px' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1} />
        <FloatingShape />
      </Canvas>
    </div>
  );
}
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ErrorBoundary } from './ErrorBoundary';

function Shape({ type, color }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      {type === 'sphere' && <sphereGeometry args={[1.5, 32, 32]} />}
      {type === 'torus' && <torusKnotGeometry args={[1, 0.3, 100, 16]} />}
      {type === 'octa' && <octahedronGeometry args={[1.5, 0]} />}
      {type === 'box' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
      {type === 'ico' && <icosahedronGeometry args={[1.5, 0]} />}
      
      <meshStandardMaterial color={color || "#4f8eff"} wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export default function Floating3D({ type, color, height = '300px' }) {
  return (
    <div style={{ width: '100%', height: height, position: 'relative' }}>
      <ErrorBoundary>
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 2, 2]} intensity={1.5} />
          <Shape type={type} color={color} />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
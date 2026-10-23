import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus } from '@react-three/drei';

function Explosion() {
  const meshRef = useRef();
  const count = 150;
  const [particles] = useState(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1;
      arr.push({
        velocity: [Math.cos(angle) * speed, Math.sin(angle) * speed, (Math.random() - 0.5) * speed],
        position: [0, 0, 0],
        scale: Math.random() * 0.2 + 0.05,
        life: 1
      });
    }
    return arr;
  });

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const children = meshRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const p = particles[i];
      if (p.life > 0) {
        child.position.x += p.velocity[0] * delta;
        child.position.y += p.velocity[1] * delta;
        child.position.z += p.velocity[2] * delta;
        p.velocity[0] *= 0.96;
        p.velocity[1] *= 0.96;
        p.life -= delta * 0.8;
        const safeLife = Math.max(0, p.life);
        child.scale.setScalar(p.scale * safeLife);
        if (child.material) child.material.opacity = safeLife;
      } else {
        child.visible = false;
      }
    }
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#ffaa00" : "#ffffff"} transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

function CollisionScene() {
  const sunRef = useRef();
  const saturnRef = useRef();
  const [exploded, setExploded] = useState(false);
  const sunPos = useRef(-4);
  const saturnPos = useRef(4);
  const timer = useRef(0);

  useFrame((state, delta) => {
    if (exploded) {
      timer.current += delta;
      if (timer.current > 3.5) {
        setExploded(false); sunPos.current = -4; saturnPos.current = 4; timer.current = 0;
      }
      return;
    }
    sunPos.current += delta * 3;
    saturnPos.current -= delta * 3;

    if (sunRef.current && saturnRef.current) {
      sunRef.current.position.x = sunPos.current;
      saturnRef.current.position.x = saturnPos.current;
      if (sunPos.current + 1.5 >= saturnPos.current - 1.5) setExploded(true);
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 10, 5]} intensity={2} />
      <pointLight position={[0, 0, 2]} intensity={3} color="#ffaa00" />
      {!exploded && (
        <>
          <Sphere ref={sunRef} args={[1.5, 32, 32]} position={[-4, 0, 0]}>
            <meshStandardMaterial color="#ffaa00" emissive="#ff4400" emissiveIntensity={1.5} />
          </Sphere>
          <group ref={saturnRef} position={[4, 0, 0]}>
            <Sphere args={[1.2, 32, 32]}><meshStandardMaterial color="#e0cda9" roughness={0.5} /></Sphere>
            <Torus args={[2, 0.15, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
              <meshStandardMaterial color="#e0cda9" opacity={0.8} transparent />
            </Torus>
          </group>
        </>
      )}
      {exploded && <Explosion />}
    </>
  );
}

export default function ThreeCollision() {
  return (
    <div style={{ width: '100%', height: '350px', marginBottom: '20px' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}><CollisionScene /></Canvas>
    </div>
  );
}
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

const goldenAngle = Math.PI * (3 - Math.sqrt(5));

export default function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = useStore((s) => s.particleCount);
  const reduceMotion = useStore((s) => s.reduceMotion);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.05, 8, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#a78bfa"),
      transparent: true,
      opacity: 0.8,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame((state) => {
    if (!meshRef.current || reduceMotion) return;

    const time = state.clock.elapsedTime;
    const maxCount = count;

    for (let i = 0; i < maxCount; i++) {
      const angle = i * goldenAngle + time * 0.1;
      const radius = 3.5 + Math.sin(time * 0.2 + i * 0.1) * 0.5;
      const height = Math.sin(time * 0.15 + i * 0.2) * 1.5;

      const x = Math.cos(angle) * radius;
      const y = height;
      const z = Math.sin(angle) * radius;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.count = maxCount;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, 150]}
      frustumCulled={false}
    />
  );
}

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

export default function StarField() {
  const pointsRef = useRef<THREE.Points>(null);
  const reduceMotion = useStore((s) => s.reduceMotion);

  const geometry = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const ops = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      ops[i] = 0.3 + Math.random() * 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aOpacity", new THREE.BufferAttribute(ops, 1));
    return geo;
  }, []);

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          attribute float aOpacity;
          varying float vOpacity;
          void main() {
            vOpacity = aOpacity;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 2.0 * (100.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying float vOpacity;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            float alpha = smoothstep(0.5, 0.2, dist) * vOpacity;
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(() => {
    if (!pointsRef.current || reduceMotion) return;
    pointsRef.current.rotation.y += 0.0003;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={shaderMaterial} />
  );
}

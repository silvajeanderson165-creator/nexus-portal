import { useRef, useEffect, useCallback, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

import NexusRing from "./NexusRing";
import ParticleField from "./ParticleField";
import StarField from "./StarField";
import { useStore } from "@/store/useStore";

export default function SceneContent() {
  const { camera, gl, scene, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const composerRef = useRef<EffectComposer | null>(null);

  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const spherical = useRef(new THREE.Spherical(8, Math.PI / 2, 0));
  const targetSpherical = useRef(new THREE.Spherical(8, Math.PI / 2, 0));
  const zoomLevel = useStore((s) => s.zoomLevel);
  const setZoomLevel = useStore((s) => s.setZoomLevel);
  const glowIntensity = useStore((s) => s.glowIntensity);
  const setIsDragging = useStore((s) => s.setIsDragging);

  // Setup post-processing
  const composer = useMemo(() => {
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      glowIntensity * 1.5,
      0.8,
      0.2
    );

    const outputPass = new OutputPass();
    const comp = new EffectComposer(gl);
    comp.addPass(renderPass);
    comp.addPass(bloomPass);
    comp.addPass(outputPass);
    return comp;
  }, [gl, scene, camera, size.width, size.height]);

  useEffect(() => {
    composerRef.current = composer;
  }, [composer]);

  // Update bloom intensity
  useEffect(() => {
    if (composerRef.current) {
      const bloomPass = composerRef.current.passes[1] as UnrealBloomPass;
      bloomPass.strength = glowIntensity * 1.5;
    }
  }, [glowIntensity]);

  // Sync zoom from store
  useEffect(() => {
    targetSpherical.current.radius = zoomLevel;
  }, [zoomLevel]);

  // Mouse events
  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      isDragging.current = true;
      setIsDragging(true);
      previousMouse.current = { x: e.clientX, y: e.clientY };
    },
    [setIsDragging]
  );

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - previousMouse.current.x;
    const dy = e.clientY - previousMouse.current.y;
    previousMouse.current = { x: e.clientX, y: e.clientY };

    targetSpherical.current.theta -= dx * 0.01;
    targetSpherical.current.phi -= dy * 0.01;
    targetSpherical.current.phi = THREE.MathUtils.clamp(
      targetSpherical.current.phi,
      0.1,
      Math.PI - 0.1
    );
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setIsDragging(false);
  }, [setIsDragging]);

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const newRadius = THREE.MathUtils.clamp(
        targetSpherical.current.radius + e.deltaY * 0.01,
        4,
        15
      );
      targetSpherical.current.radius = newRadius;
      setZoomLevel(newRadius);
    },
    [setZoomLevel]
  );

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [gl, onPointerDown, onPointerMove, onPointerUp, onWheel]);

  // Smooth camera update + render via composer
  useFrame(() => {
    spherical.current.radius +=
      (targetSpherical.current.radius - spherical.current.radius) * 0.1;
    spherical.current.theta +=
      (targetSpherical.current.theta - spherical.current.theta) * 0.1;
    spherical.current.phi +=
      (targetSpherical.current.phi - spherical.current.phi) * 0.1;

    const pos = new THREE.Vector3().setFromSpherical(spherical.current);
    camera.position.copy(pos);
    camera.lookAt(0, 0, 0);

    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  return (
    <>
      <ambientLight intensity={0.2} color="#404040" />
      <directionalLight intensity={0.5} position={[5, 5, 5]} color="#ffffff" />

      <group ref={groupRef}>
        <NexusRing />
        <ParticleField />
        <StarField />
      </group>
    </>
  );
}

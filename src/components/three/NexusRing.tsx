import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

const COLOR_THEMES: Record<
  string,
  { c1: THREE.Color; c2: THREE.Color; c3: THREE.Color; hue: number }
> = {
  default: {
    c1: new THREE.Color("#60a5fa"),
    c2: new THREE.Color("#a78bfa"),
    c3: new THREE.Color("#22d3ee"),
    hue: 0,
  },
  blue: {
    c1: new THREE.Color("#1d4ed8"),
    c2: new THREE.Color("#3b82f6"),
    c3: new THREE.Color("#60a5fa"),
    hue: 0,
  },
  purple: {
    c1: new THREE.Color("#6d28d9"),
    c2: new THREE.Color("#8b5cf6"),
    c3: new THREE.Color("#c4b5fd"),
    hue: 0.5,
  },
  gold: {
    c1: new THREE.Color("#b45309"),
    c2: new THREE.Color("#f59e0b"),
    c3: new THREE.Color("#fcd34d"),
    hue: 3.0,
  },
  red: {
    c1: new THREE.Color("#991b1b"),
    c2: new THREE.Color("#ef4444"),
    c3: new THREE.Color("#fca5a5"),
    hue: 1.0,
  },
};

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vPulse;
  uniform float uPulse;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    vPulse = uPulse;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uHueShift;
  uniform float uGlowIntensity;
  uniform vec2 uMouse;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vPulse;

  vec3 hueShift(vec3 color, float hue) {
    float cosA = cos(hue);
    float sinA = sin(hue);
    mat3 yiqMatrix = mat3(
      0.299, 0.587, 0.114,
      0.596, -0.275, -0.321,
      0.212, -0.523, 0.311
    );
    mat3 rgbMatrix = mat3(
      1.0, 0.956, 0.621,
      1.0, -0.272, -0.647,
      1.0, -1.107, 1.705
    );
    vec3 yiq = yiqMatrix * color;
    float y = yiq.x;
    float i = yiq.y * cosA - yiq.z * sinA;
    float q = yiq.y * sinA + yiq.z * cosA;
    return rgbMatrix * vec3(y, i, q);
  }

  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }

  vec3 iridescence(vec3 normal, vec3 viewDir, float time) {
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    float hue = fresnel * 2.0 + time * 0.1;
    vec3 color1 = hsl2rgb(vec3(fract(hue + 0.5), 0.8, 0.6));
    vec3 color2 = hsl2rgb(vec3(fract(hue), 0.9, 0.5));
    return mix(color1, color2, fresnel);
  }

  // Simplex 3D Noise 
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);

    // Usa noise na topologia calculada via posição para orgânica
    float noiseVal = snoise(vPosition * 1.2 + uTime * 0.3);
    float noiseVal2 = snoise(vPosition * 2.0 - uTime * 0.15);

    // Mouse proximity distortion — puxa iridescência pro cursor
    float mouseDist = length(vUv - (uMouse * 0.5 + 0.5));
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDist);

    // Adiciona o noise para influenciar a mistura
    float t1 = dot(vNormal, vec3(1.0, 0.0, 0.0)) * 0.5 + 0.5 + noiseVal * 0.4;
    float t2 = dot(vNormal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5 + noiseVal2 * 0.3;

    // Garante que t não passe de 0-1
    vec3 baseColor = mix(uColor1, uColor2, clamp(t1, 0.0, 1.0));
    baseColor = mix(baseColor, uColor2 * 1.5, clamp(t2 * mouseInfluence, 0.0, 1.0));

    baseColor = hueShift(baseColor, uHueShift + mouseInfluence * 0.3);

    // O iridescence usa o norm + um distúrbio de tempo com ruído para o efeito de plasma dinâmico
    vec3 ired = iridescence(vNormal, viewDir, uTime + noiseVal * 3.0 + mouseInfluence * 2.0);
    
    // Potencializado com base no ruído e mouse
    baseColor += ired * (0.5 + mouseInfluence * 0.4) * uGlowIntensity * (0.8 + noiseVal * 0.5);

    baseColor += vec3(vPulse * 0.3);

    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

export default function NexusRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pulseRef = useRef({ value: 0 });

  const colorTheme = useStore((s) => s.colorTheme);
  const glowIntensity = useStore((s) => s.glowIntensity);
  const pulseTrigger = useStore((s) => s.pulseTrigger);
  const reduceMotion = useStore((s) => s.reduceMotion);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#60a5fa") },
      uColor2: { value: new THREE.Color("#a78bfa") },
      uColor3: { value: new THREE.Color("#22d3ee") },
      uHueShift: { value: 0 },
      uGlowIntensity: { value: 1.0 },
      uPulse: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  // Update colors when theme changes
  useMemo(() => {
    const theme = COLOR_THEMES[colorTheme] || COLOR_THEMES.default;
    uniforms.uColor1.value.copy(theme.c1);
    uniforms.uColor2.value.copy(theme.c2);
    uniforms.uColor3.value.copy(theme.c3);
    uniforms.uHueShift.value = theme.hue;
  }, [colorTheme, uniforms]);

  // Update glow intensity
  useMemo(() => {
    uniforms.uGlowIntensity.value = glowIntensity;
  }, [glowIntensity, uniforms]);

  // Pulse animation
  useMemo(() => {
    if (pulseTrigger > 0) {
      pulseRef.current.value = 1.0;
      const startTime = Date.now();
      const duration = 1500;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        pulseRef.current.value = 1.0 - Math.pow(progress, 2);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [pulseTrigger]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uPulse.value = pulseRef.current.value;
    
    // Suaviza a adoção do mouse
    const tx = state.pointer.x;
    const ty = state.pointer.y;
    materialRef.current.uniforms.uMouse.value.x += (tx - materialRef.current.uniforms.uMouse.value.x) * 0.05;
    materialRef.current.uniforms.uMouse.value.y += (ty - materialRef.current.uniforms.uMouse.value.y) * 0.05;

    if (!reduceMotion) {
      // Reage à posição do mouse fisicamente!
      meshRef.current.rotation.y += (0.15 + materialRef.current.uniforms.uMouse.value.x * 0.1) * state.clock.getDelta() * 10;
      meshRef.current.rotation.x += 0.005 + materialRef.current.uniforms.uMouse.value.y * 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[2, 0.5, 128, 32, 2, 3]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

import { Suspense, lazy, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Lenis from "lenis";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";
import ExploreSection from "@/sections/ExploreSection";
import SpecsSection from "@/sections/SpecsSection";
import CustomizeSection from "@/sections/CustomizeSection";
import AboutSection from "@/sections/AboutSection";
import CustomCursor from "@/components/ui-custom/CustomCursor";
import { useStore } from "@/store/useStore";
import { synth } from "@/hooks/useAudio";

const SceneContent = lazy(() => import("@/components/three/SceneContent"));

function ThreeCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 1000, position: [0, 0, 8] }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#050505");
        }}
        style={{ background: "#050505" }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function App() {
  const isLoading = useStore((s) => s.isLoading);

  useEffect(() => {
    // Inicializa o Lenis para Scroll Suave (Pilar de Design Premium)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      smoothWheel: true,
    });

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }

    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className="relative w-full min-h-screen bg-[#050505] selection:bg-violet-500/30"
      onClick={() => synth.init()}
    >
      <CustomCursor />
      {isLoading && <LoadingScreen />}
      <ThreeCanvas />
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <ExploreSection />
        <SpecsSection />
        <CustomizeSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}

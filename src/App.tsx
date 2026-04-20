import { Suspense, lazy } from "react";
import { Canvas } from "@react-three/fiber";
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

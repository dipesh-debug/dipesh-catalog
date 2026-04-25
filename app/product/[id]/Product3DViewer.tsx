"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Loader,
  Bounds
} from "@react-three/drei";

// Helper component to load the model and be suspended
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // Fix orientation: [X, Y, Z] in radians. Math.PI = 180 degrees.
  // - Math.PI on X flips it upright if it's currently upside down.
  // - Math.PI on Y spins it 180 degrees if it's currently facing backward.
  return <primitive object={scene} />;
}

export default function Product3DViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="min-h-[600px] w-full h-full"
      >
        <ambientLight intensity={1.5} />
        <spotLight
          intensity={1}
          angle={0.1}
          penumbra={1}
          position={[10, 15, 10]}
          castShadow
        />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Model url={modelUrl} />
          </Bounds>
          <Environment preset="city" />
          <ContactShadows
            position={[0, -0.9, 0]}
            opacity={0.5}
            scale={10}
            blur={1.5}
            far={0.8}
          />
        </Suspense>
        <OrbitControls makeDefault enableZoom={true} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
      {/* The built-in Drei Loader sits outside the Canvas! */}
      <Loader />
    </>
  );
}
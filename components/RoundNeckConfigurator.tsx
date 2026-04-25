"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls, useGLTF, Bounds } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface ConfiguratorProps {
  frontImage?: string | null;
  backImage?: string | null;
  frontColor?: string;
  backColor?: string;
}

function ShirtModel({ frontImage, backImage, frontColor = '#ffffff', backColor = '#ffffff' }: ConfiguratorProps) {
  // Load the base 3D model
  const { scene, materials } = useGLTF('/base-roundneck.glb') as any;
  console.log('--- 3D MATERIALS DETECTED ---', materials);

  useEffect(() => {
    if (!materials.material || !materials.material_1) return;

    // Apply Front Material Updates (material)
    if (frontImage) {
      const texture = new THREE.TextureLoader().load(frontImage);
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      materials.material.map = texture;
      const targetWhite = new THREE.Color('#ffffff');
      gsap.to(materials.material.color, { r: targetWhite.r, g: targetWhite.g, b: targetWhite.b, duration: 0.6, ease: 'power2.inOut' }); // Prevent color tinting over the image
    } else {
      materials.material.map = null;
      const targetFront = new THREE.Color(frontColor || '#ffffff');
      gsap.to(materials.material.color, { r: targetFront.r, g: targetFront.g, b: targetFront.b, duration: 0.6, ease: 'power2.inOut' });
    }
    materials.material.roughness = 0.8;
    materials.material.metalness = 0.1;
    materials.material.needsUpdate = true;

    // Apply Back Material Updates (material_1)
    if (backImage) {
      const texture = new THREE.TextureLoader().load(backImage);
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      materials.material_1.map = texture;
      const targetWhite = new THREE.Color('#ffffff');
      gsap.to(materials.material_1.color, { r: targetWhite.r, g: targetWhite.g, b: targetWhite.b, duration: 0.6, ease: 'power2.inOut' }); // Prevent color tinting over the image
    } else {
      materials.material_1.map = null;
      const targetBack = new THREE.Color(backColor || '#ffffff');
      gsap.to(materials.material_1.color, { r: targetBack.r, g: targetBack.g, b: targetBack.b, duration: 0.6, ease: 'power2.inOut' });
    }
    materials.material_1.roughness = 0.8;
    materials.material_1.metalness = 0.1;
    materials.material_1.needsUpdate = true;
    
  }, [frontImage, backImage, frontColor, backColor, materials]);

  return <primitive object={scene} />;
}

export default function RoundNeckConfigurator({ frontImage, backImage, frontColor, backColor }: ConfiguratorProps) {
  return (
    <div className="w-full h-full min-h-[600px]">
      <Canvas>
        <ambientLight intensity={0.4} />
        {/* Main Key Light to highlight the chest and collar */}
        <directionalLight position={[2, 5, 5]} intensity={1.5} castShadow />
        {/* Rim Light to separate the dark shirt from the background */}
        <directionalLight position={[-3, 5, -5]} intensity={2} color="#ffffff" />
        {/* Soft fill light from below to show the hem */}
        <pointLight position={[0, -2, 2]} intensity={0.5} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <ShirtModel frontImage={frontImage} backImage={backImage} frontColor={frontColor} backColor={backColor} />
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
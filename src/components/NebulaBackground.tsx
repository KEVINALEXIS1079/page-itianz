"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Center, Float, Environment, Stars, useMatcapTexture, Octahedron } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";

// Ya no necesitamos renderTarget ni cubeCamera porque quitamos los espejos

// 1. Texto 3D de Alta Gama
function HeroText() {
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / 20);
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  
  useFrame((state) => {
    if (groupRef.current) {
      const scrollY = window.scrollY || 0;
      
      targetRotation.current.x = (state.pointer.y * Math.PI) / 30;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 30;
      
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.05;
      
      const idleY = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      
      const targetZ = scrollY * 0.03; 
      const targetY = scrollY * 0.005; 
      
      groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.05; 
      groupRef.current.position.y += ((1 + targetY + idleY) - groupRef.current.position.y) * 0.05; 
      
      groupRef.current.rotation.x -= scrollY * 0.0003;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center scale={scale} position={[0, 1, 0]}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={3.5}
            height={0.8}
            curveSegments={64}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={16}
          >
            ITIANZ
            <meshStandardMaterial 
              color="#b0b0b0" 
              metalness={0.9} 
              roughness={0.2} 
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
}

// 2. Iluminación Profesional
function CinematicStudio() {
  return (
    <group>
      {/* Iluminación de Estudio de Alto Contraste */}
      <ambientLight intensity={0.05} color="#ffffff" />
      {/* Key Light: Blanco suave frontal derecho para modelar el metal (Reducido para no quemar la imagen) */}
      <spotLight position={[30, 10, 30]} intensity={150} color="#ffffff" angle={0.8} penumbra={1} distance={150} decay={1.5} />
      {/* Fill Light: Rojo intenso envolvente desde la izquierda */}
      <spotLight position={[-40, 0, 30]} intensity={1200} color="#ff1a1a" angle={0.8} penumbra={1} distance={150} decay={1.5} />
      {/* Rim Light / Backlight: Rojo desde atrás para recortar la silueta */}
      <spotLight position={[-20, -10, -20]} intensity={2000} color="#ff0000" angle={1} penumbra={1} distance={150} decay={1.5} />

      <Environment preset="studio" environmentIntensity={0.2} />
    </group>
  );
}

// 4. Escena Principal
export function NebulaBackground() {
  return (
    <div className="absolute inset-0 z-[-1] w-full h-full bg-[#000000]">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }} dpr={[1, 1.2]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <color attach="background" args={['#000000']} />
        
        {/* Niebla empujada hacia atrás para que no oculte las estrellas */}
        <fog attach="fog" args={['#000000', 80, 200]} />
        
        {/* Estrellas con parpadeo más natural (velocidad reducida) */}
        <Stars radius={100} depth={50} count={2000} factor={5} saturation={0} fade speed={1.5} />

        <HeroText />
        <CinematicStudio />

        {/* Post-procesamiento Premium (Bloom reducido para no quemar blancos) */}
        <EffectComposer>
          <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.8} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

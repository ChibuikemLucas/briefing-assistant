'use client'

import React, { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

function FloatingNotebook() {
    const notebookRef = React.useRef<THREE.Group>(null)

    // Gentle floating and subtle wobble
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (notebookRef.current) {
            notebookRef.current.rotation.y = Math.sin(t * 0.3) * 0.1
            notebookRef.current.rotation.x = Math.sin(t * 0.2) * 0.05
            notebookRef.current.position.y = Math.sin(t) * 0.25
        }
    })

    return (
        <group ref={notebookRef}>
            {/* Paper Stack (white block) */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.1, 0.25, 3]} />
                <meshStandardMaterial color="#ffffff" roughness={0.7} metalness={0.2} />
            </mesh>

            {/* Spiral Binds (ash-gray) */}
            {[-1.2, -0.4, 0.4, 1.2].map((z, i) => (
                <mesh key={i} position={[-1.1, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.12, 0.04, 12, 24]} />
                    <meshStandardMaterial color="#b0b0b0" metalness={0.4} roughness={0.4} />
                </mesh>
            ))}

            {/* Metallic Gothic Text */}
            <Center position={[0, 0.15, 1.55]}>
                <Text3D
                    font="/fonts/MetalGothic_Regular.json" // make sure this font file is placed in /public/fonts
                    size={0.25}
                    height={0.05}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.01}
                >
                    SUMMARY 3D VIEW
                    <meshStandardMaterial color="#b0b0b0" metalness={1} roughness={0.2} />
                </Text3D>
            </Center>
        </group>
    )
}

export default function ThreeScene() {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} shadows>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                <Suspense fallback={<Html>Loading Scene...</Html>}>
                    <FloatingNotebook />
                </Suspense>

                {/* ✅ Rotate freely but no zoom */}
                <OrbitControls enableZoom={false} enableRotate={true} />
            </Canvas>
        </div>
    )
}

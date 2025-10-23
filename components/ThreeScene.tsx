'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'

function RotatingCube() {
    return (
        <mesh rotation={[0.6, 0.6, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#6366f1" metalness={0.6} roughness={0.3} />
        </mesh>
    )
}

export default function ThreeScene() {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 6] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} />
                <Suspense fallback={<Html>Loading Scene...</Html>}>
                    <RotatingCube />
                </Suspense>
                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
    )
}

// src/components/BankScene3D.jsx
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Komponen Bank Building 3D sederhana
function BankBuilding() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            // Rotasi halus
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Base building */}
            <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[2, 3, 2]} />
                <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.4} />
            </mesh>

            {/* Roof */}
            <mesh position={[0, 1.8, 0]} castShadow>
                <coneGeometry args={[1.5, 0.8, 4]} />
                <meshStandardMaterial color="#2563eb" metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Pillars */}
            {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
                <mesh key={i} position={[x, -0.5, 1.1]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 2]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.2} />
                </mesh>
            ))}

            {/* Door */}
            <mesh position={[0, -0.8, 1.01]}>
                <boxGeometry args={[0.6, 1.2, 0.1]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Windows */}
            {[0.5, -0.5].map((x, i) => (
                <React.Fragment key={i}>
                    <mesh position={[x, 0.3, 1.01]}>
                        <boxGeometry args={[0.4, 0.5, 0.05]} />
                        <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.2} />
                    </mesh>
                    <mesh position={[x, -0.3, 1.01]}>
                        <boxGeometry args={[0.4, 0.5, 0.05]} />
                        <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.2} />
                    </mesh>
                </React.Fragment>
            ))}

            {/* Floating coins */}
            <FloatingCoins />
        </group>
    );
}

// Komponen koin yang melayang
function FloatingCoins() {
    const coinsRef = useRef();

    useFrame((state) => {
        if (coinsRef.current) {
            coinsRef.current.children.forEach((coin, i) => {
                coin.position.y = Math.sin(state.clock.elapsedTime + i) * 0.3;
                coin.rotation.y += 0.02;
            });
        }
    });

    return (
        <group ref={coinsRef}>
            {[
                { pos: [-2, 1, 0], color: '#fbbf24' },
                { pos: [2, 0.5, 0], color: '#f59e0b' },
                { pos: [-1.5, -0.5, 1], color: '#fbbf24' },
                { pos: [1.8, 1.2, -0.5], color: '#f59e0b' },
            ].map((coin, i) => (
                <mesh key={i} position={coin.pos}>
                    <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
                    <meshStandardMaterial
                        color={coin.color}
                        metalness={0.8}
                        roughness={0.2}
                        emissive={coin.color}
                        emissiveIntensity={0.3}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Scene utama
export default function BankScene3D() {
    return (
        <Canvas
            shadows
            style={{ width: '100%', height: '100%' }}
            gl={{ alpha: true, antialias: true }}
        >
            {/* Camera */}
            <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={50} />

            {/* Lights */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <pointLight position={[-3, 2, 2]} intensity={0.5} color="#3b82f6" />
            <pointLight position={[3, 2, -2]} intensity={0.5} color="#7c3aed" />

            {/* Bank Building */}
            <BankBuilding />

            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial
                    color="#e2e8f0"
                    metalness={0.1}
                    roughness={0.8}
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Controls */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 4}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </Canvas>
    );
}

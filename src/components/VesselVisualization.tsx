import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface VesselVisualizationProps {
  diameter: number;
  wallThickness: number;
  headType: string;
  length?: number;
}

function Vessel({ diameter, wallThickness, headType, length = 2000 }: VesselVisualizationProps) {
  const radiusOuter = diameter / 2000;
  const radiusInner = (diameter - 2 * wallThickness) / 2000;
  const vesselLength = length / 1000;

  const headGeometry = useMemo(() => {
    if (headType === 'elliptical') {
      return { height: radiusOuter * 0.5, type: 'elliptical' };
    } else if (headType === 'hemispherical') {
      return { height: radiusOuter, type: 'hemispherical' };
    } else {
      return { height: radiusOuter * 0.2, type: 'flat' };
    }
  }, [headType, radiusOuter]);

  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radiusOuter, radiusOuter, vesselLength, 32]} />
        <meshStandardMaterial color="#a8b3c1" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radiusInner, radiusInner, vesselLength + 0.01, 32]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {headType === 'hemispherical' ? (
        <>
          <mesh position={[0, vesselLength / 2, 0]}>
            <sphereGeometry args={[radiusOuter, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#a8b3c1" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -vesselLength / 2, 0]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[radiusOuter, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#a8b3c1" metalness={0.7} roughness={0.3} />
          </mesh>
        </>
      ) : headType === 'elliptical' ? (
        <>
          <mesh position={[0, vesselLength / 2, 0]} scale={[1, 0.5, 1]}>
            <sphereGeometry args={[radiusOuter, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#a8b3c1" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -vesselLength / 2, 0]} rotation={[Math.PI, 0, 0]} scale={[1, 0.5, 1]}>
            <sphereGeometry args={[radiusOuter, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#a8b3c1" metalness={0.7} roughness={0.3} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, vesselLength / 2, 0]}>
            <cylinderGeometry args={[radiusOuter, radiusOuter, 0.05, 32]} />
            <meshStandardMaterial color="#a8b3c1" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -vesselLength / 2, 0]}>
            <cylinderGeometry args={[radiusOuter, radiusOuter, 0.05, 32]} />
            <meshStandardMaterial color="#a8b3c1" metalness={0.7} roughness={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function VesselVisualization(props: VesselVisualizationProps) {
  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-slate-700">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full text-white">
          Загрузка 3D модели...
        </div>
      }>
        <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[3, 2, 4]} />
          <OrbitControls enableZoom={true} enablePan={true} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={0.5} />
          
          <Vessel {...props} />
          
          <gridHelper args={[10, 20, '#444', '#222']} position={[0, -1.5, 0]} />
        </Canvas>
      </Suspense>
    </div>
  );
}
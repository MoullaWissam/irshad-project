import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, ContactShadows, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function Model({ mousePos }) {
  // تأكد من المسار
  const { scene } = useGLTF('/models/Murshed.glb');
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      // 1. تحديد الزوايا القصوى للدوران (حتى لا يلف الرأس للخلف)
      const targetRotationY = mousePos.x * 0.9; // التفات يمين/يسار
      const targetRotationX = mousePos.y * 0.5; // التفات أعلى/أسفل

      // 2. حركة ناعمة باستخدام MathUtils.lerp
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotationY,
        0.1
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetRotationX,
        0.1
      );

      // 3. إضافة ميلان خفيف للكتف (اختياري يعطي واقعية)
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        mousePos.x * 0.1, 
        0.1
      );
    }
  });

  return (
    // Float تعطي حركة عائمة بسيطة وتلقائية تجعل البوت يبدو حياً
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive 
        ref={group} 
        object={scene} 
        scale={2.5}
        position={[0, -1.0, 0]}  // تم تغييره من -1.8 إلى -1.0 لجعله أعلى
      />
    </Float>
  );
}

const InteractiveAvatar = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      // حساب موقع الفأرة نسبةً لمنتصف الشاشة
      setMousePos({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Model mousePos={mousePos} />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={5} blur={2} far={3} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default InteractiveAvatar;
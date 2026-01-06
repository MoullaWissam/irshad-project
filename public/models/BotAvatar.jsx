// src/assets/models/BotAvatar.js
import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// مكون تحميل مؤقت
function LoadingIndicator({ progress }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={`hsl(${progress * 3.6}, 100%, 50%)`} />
      </mesh>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(progress)}%
      </Text>
    </group>
  );
}

// المكون الرئيسي
export function BotAvatar(props) {
  const group = useRef();
  const { nodes, materials, animations, scene } = useGLTF('/models/Murshed-compressed.glb');
  const { actions } = useAnimations(animations, group);

  // تشغيل الحركة التلقائية
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0];
      actions[actionName].play();
    }
    
    return () => {
      // تنظيف الرسوم المتحركة عند إلغاء التحميل
      if (actions && Object.keys(actions).length > 0) {
        Object.values(actions).forEach(action => {
          if (action) action.stop();
        });
      }
    };
  }, [actions]);

  // دوران مستمر
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {scene ? (
        <primitive object={scene} />
      ) : (
        // Fallback if scene is not available
        <LoadingIndicator progress={0} />
      )}
    </group>
  );
}

// التحميل المسبق للنموذج
useGLTF.preload('/models/Murshed-compressed.glb');

export default BotAvatar;
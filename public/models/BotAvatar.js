// src/assets/models/BotAvatar.js
import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export function BotAvatar(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/models/bot-model.glb');
  const { actions } = useAnimations(animations, group);

  // تشغيل الحركة التلقائية
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0];
      actions[actionName].play();
    }
  }, [actions]);

  // دوران مستمر
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* ستجد هنا الهيكل التلقائي - يمكنك تعديله حسب نموذجك */}
      <primitive object={nodes.scene} />
    </group>
  );
}

useGLTF.preload('/models/bot-model.glb');
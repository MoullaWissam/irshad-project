// src/utils/modelOptimizer.js
import { useState, useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// تهيئة Draco Loader (للفك الضغط)
let dracoLoader = null;

const getGLTFLoader = () => {
  const loader = new GLTFLoader();
  
  // تهيئة Draco loader مرة واحدة فقط
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  }
  
  loader.setDRACOLoader(dracoLoader);
  return loader;
};

// Hook لتحميل النماذج بذكاء
export const useOptimizedModel = (modelPath, options = {}) => {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    let loader = null;
    
    const loadModel = async () => {
      if (!mounted || !modelPath) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. تحقق من وجود نسخة مخبأة
        const cacheKey = `model_cache_${modelPath.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached && options.useCache !== false) {
          const cacheData = JSON.parse(cached);
          const cacheAge = Date.now() - cacheData.timestamp;
          
          // استخدام الكاش فقط إذا كان عمره أقل من 24 ساعة
          if (cacheAge < 24 * 60 * 60 * 1000) {
            console.log('Using cached model data');
            if (mounted) {
              setModel({ scene: cacheData.sceneData });
            }
            setIsLoading(false);
            return;
          }
        }
        
        // 2. تحميل النموذج
        loader = getGLTFLoader();
        
        loader.load(
          modelPath,
          (gltf) => {
            if (!mounted) return;
            
            // 3. تخفيف النموذج إذا كان معقداً
            const optimizedScene = optimizeScene(gltf.scene, options);
            
            // 4. حفظ بيانات بسيطة في الكاش
            if (options.useCache !== false) {
              const cacheData = {
                timestamp: Date.now(),
                sceneData: serializeSceneData(optimizedScene),
              };
              
              try {
                localStorage.setItem(cacheKey, JSON.stringify(cacheData));
              } catch (e) {
                console.warn('LocalStorage quota exceeded, clearing old cache');
                clearOldCache();
              }
            }
            
            setModel(gltf);
            setIsLoading(false);
          },
          (xhr) => {
            if (mounted) {
              const percent = Math.round((xhr.loaded / xhr.total) * 100);
              setProgress(percent);
            }
          },
          (err) => {
            if (mounted) {
              setError(err.message || 'Failed to load model');
              setIsLoading(false);
            }
          }
        );
        
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };
    
    loadModel();
    
    return () => {
      mounted = false;
      if (loader) {
        // يمكن إلغاء التحميل إذا كان يدعم ذلك
      }
    };
  }, [modelPath, options.useCache]);
  
  return { model, error, progress, isLoading };
};

// وظيفة مساعدة لتحسين المشهد
const optimizeScene = (scene, options) => {
  if (!scene) return scene;
  
  scene.traverse((node) => {
    if (node.isMesh) {
      // تقليل مستوى التفاصيل إذا كانت الخيارات تسمح بذلك
      if (options.simplifyGeometry && node.geometry) {
        // يمكن إضافة منطق لتبسيط الهندسة هنا
      }
      
      // تحسين إعدادات المواد
      if (node.material) {
        optimizeMaterial(node.material, options);
      }
    }
  });
  
  return scene;
};

// تحسين إعدادات المواد
const optimizeMaterial = (material, options) => {
  if (!material) return;
  
  // تقليل جودة المواد إذا طلبنا ذلك
  if (options.lowQuality) {
    material.roughness = 1;
    material.metalness = 0;
    material.needsUpdate = true;
  }
  
  // تقليل دقة القوام إذا كانت موجودة
  if (material.map) {
    material.map.anisotropy = 1;
  }
  
  return material;
};

// تسجيل بيانات المشهد للكاش (نسخة مبسطة)
const serializeSceneData = (scene) => {
  // هنا يمكنك تسجيل البيانات الأساسية فقط
  // هذا مثال مبسط - في الحقيقة قد تحتاج لتسجيل أكثر
  return {
    type: 'Object3D',
    childrenCount: scene.children?.length || 0,
  };
};

// تنظيف الكاش القديم
const clearOldCache = () => {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('model_cache_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (now - data.timestamp > 7 * dayInMs) { // أقدم من أسبوع
          localStorage.removeItem(key);
        }
      } catch (e) {
        localStorage.removeItem(key);
      }
    }
  }
};

// وظيفة لضغط النموذج على العميل (للملفات الصغيرة)
export const optimizeModelInBrowser = async (modelUrl, options = {}) => {
  // تحذير: هذه العملية قد تكون ثقيلة على العميل
  // من الأفضل ضغط النماذج على الخادم
  
  console.log('Starting model optimization in browser...');
  
  try {
    const response = await fetch(modelUrl);
    const blob = await response.blob();
    
    // هنا يمكنك إضافة منطق لمعالجة الـ blob
    // مثل تحويله إلى نموذج أقل جودة
    
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Model optimization failed:', error);
    return modelUrl; // إرجاع الرابط الأصلي في حالة الفشل
  }
};

export default {
  useOptimizedModel,
  optimizeModelInBrowser,
};
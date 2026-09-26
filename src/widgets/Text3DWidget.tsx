import { useRef } from 'react';
import { useMqttWidget } from '../hooks/useMqttWidget';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Environment } from '@react-three/drei';

const RotatingText = ({ text }: { text: string }) => {
  const meshRef = useRef<any>();
  
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Text
        ref={meshRef}
        fontSize={2}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {text}
      </Text>
    </Float>
  );
};

export const Text3DWidget = () => {
  const { text: mqttText } = useMqttWidget();
  const text = mqttText || 'OBS WIDGET';

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <RotatingText text={text} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Text3DWidget;

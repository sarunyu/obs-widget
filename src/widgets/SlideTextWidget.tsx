import { useState, useEffect } from 'react';
import { useMqttWidget } from '../hooks/useMqttWidget';

export const SlideTextWidget = () => {
  const { text: mqttText } = useMqttWidget();
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (mqttText) {
      setText(mqttText);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [mqttText]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      background: 'transparent'
    }}>
      <div style={{
        position: 'absolute',
        bottom: '50px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '150%'})`,
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease-in-out',
        opacity: isVisible ? 1 : 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#00ffcc',
        padding: '20px 40px',
        borderRadius: '12px',
        fontSize: '48px',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: '2px solid #00ffcc',
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }}>
        {text}
      </div>
    </div>
  );
};

export default SlideTextWidget;

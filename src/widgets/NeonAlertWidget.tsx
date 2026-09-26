import { useState, useEffect, useRef } from 'react';
import { useMqttWidget } from '../hooks/useMqttWidget';

export const NeonAlertWidget = () => {
  const { text: mqttText } = useMqttWidget();
  const [username, setUsername] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (mqttText) {
      setUsername(mqttText);
      setIsVisible(true);

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      hideTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    } else {
      setIsVisible(false);
    }
  }, [mqttText]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'transparent', position: 'relative' }}>
      <div 
        className={`glass-neon-panel flex items-center p-6 gap-6 absolute bottom-24 left-1/2 -translate-x-1/2 w-auto max-w-2xl ${isVisible ? 'animate-pop-in' : 'animate-pop-out'}`}
        style={{
          // Force reset opacity when unmounting/mounting if needed, but animation classes handle it
        }}
      >
        {/* Glowing Icon Container */}
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-cyan-400 spin-slow opacity-70"></div>
          <div className="absolute inset-2 rounded-full border-2 border-pink-500 shadow-[0_0_15px_#ff00ff]"></div>
          
          <svg className="w-8 h-8 text-white z-10 drop-shadow-[0_0_8px_rgba(255,255,255,1)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
          </svg>
        </div>

        {/* Text Content */}
        <div className="flex flex-col pr-4">
          <span className="font-cyber text-lg tracking-widest neon-text-cyan uppercase">
            New Alert
          </span>
          <span className="font-body text-4xl font-extrabold text-white mt-[-4px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            {username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NeonAlertWidget;

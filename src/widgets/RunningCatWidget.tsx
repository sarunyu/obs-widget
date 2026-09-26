import { useEffect, useState } from 'react';

export const RunningCatWidget = () => {
  const [active, setActive] = useState(false);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  
  useEffect(() => {
    let startTimeout: number;
    let endTimeout: number;
    
    const triggerRun = () => {
      // Randomly pick direction
      const dir = Math.random() > 0.5 ? 'right' : 'left';
      setDirection(dir);
      
      // Need a tiny delay to ensure transition=none is applied before we trigger transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setActive(true);
        });
      });
      
      // Cat runs for 8 seconds
      endTimeout = window.setTimeout(() => {
        setActive(false);
        // Schedule next run (between 20s and 60s)
        const nextDelay = Math.random() * 40000 + 20000;
        startTimeout = window.setTimeout(triggerRun, nextDelay);
      }, 8000);
    };

    // First run starts after 5 seconds to give time to load
    startTimeout = window.setTimeout(triggerRun, 5000);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(endTimeout);
    };
  }, []);

  // If active is true, we transition from start to end.
  const getTransform = () => {
    if (direction === 'right') {
      return active ? 'translateX(110vw)' : 'translateX(-400px)';
    } else {
      return active ? 'translateX(-400px)' : 'translateX(110vw)';
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative pointer-events-none">
      <div 
        className="absolute bottom-20 left-0 w-[350px]"
        style={{
          transform: getTransform(),
          transition: active ? 'transform 8s linear' : 'none',
        }}
      >
        <img 
          src="/assets/nyan-cat.gif" 
          alt="Nyan Cat" 
          className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,105,180,0.4)]"
          style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
        />
      </div>
    </div>
  );
};

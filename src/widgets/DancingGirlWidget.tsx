import { useEffect, useState } from 'react';

export const DancingGirlWidget = () => {
  // Default is a dancing anime girl GIF (Chika Fujiwara)
  // Users can override this by passing ?url=YOUR_GIF_URL
  const [gifUrl, setGifUrl] = useState('https://media.giphy.com/media/m3SYKzhmod1IY/giphy.gif');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('url')) {
      setGifUrl(params.get('url')!);
    }
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent flex justify-center items-end pb-10 pointer-events-none">
      <div className="relative">
        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/20 rounded-[100%] blur-sm animate-[shadow-pulse_0.5s_alternate_infinite_cubic-bezier(0.5,0.05,1,0.5)]"></div>
        
        {/* Character */}
        <img 
          src={gifUrl} 
          alt="Dancing Girl" 
          className="max-h-[80vh] w-auto drop-shadow-2xl object-contain"
        />
      </div>
    </div>
  );
};

export default DancingGirlWidget;

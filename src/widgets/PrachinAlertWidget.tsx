import { useState, useEffect, useRef } from 'react';

export const PrachinAlertWidget = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDisplay, setCurrentDisplay] = useState<{ title: string; body: string; timeAgo: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);
  const cycleTimeoutRef = useRef<number | null>(null);

  // Helper function to calculate time ago
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const diffMs = new Date().getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'เมื่อสักครู่';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    return `${Math.floor(diffHours / 24)} วันที่แล้ว`;
  };

  // 1. Fetch Data Every 1 Minute
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const targetUrl = `/api/announcements?_t=${new Date().getTime()}`;
        
        const res = await fetch(targetUrl);
        if (!res.ok) return;
        
        const data = await res.json();
        
        // The API returns { generated_at: '...', count: X, items: [...] }
        const items = Array.isArray(data) ? data : (data.items || []);
        
        if (items.length > 0) {
          setAnnouncements(items);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };

    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 60000); // 1 minute
    
    return () => clearInterval(interval);
  }, []);

  // 2. Loop through announcements to display them
  useEffect(() => {
    if (announcements.length === 0) return;

    const showNextAnnouncement = () => {
      const item = announcements[currentIndex];
      
      const timeStr = item.created_at || item.timestamp || item.date || item.time || '';
      
      setCurrentDisplay({
        title: item.title || 'ประกาศแจ้งเตือน',
        body: item.message || item.body || item.content || item.text || '',
        timeAgo: getTimeAgo(timeStr)
      });
      
      setIsVisible(true);

      // Slide out after 10 seconds
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      // Schedule next item to show 5 seconds after the current one hides (15s total cycle)
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
      cycleTimeoutRef.current = window.setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 15000);
    };

    showNextAnnouncement();

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
    };
  }, [announcements, currentIndex]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'transparent', position: 'relative' }}>
      
      {/* Container that slides/pops in */}
      <div 
        className={`absolute top-10 right-10 max-w-md w-full transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[120%]'
        }`}
      >
        {/* The Graphic Card */}
        <div className="bg-slate-900/90 backdrop-blur-md border-l-4 border-l-red-500 rounded-lg p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-slate-700 relative overflow-hidden">
          
          {/* Flashing Alert Indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 animate-pulse"></div>

          <div className="flex items-start gap-4">
            {/* Warning Icon */}
            <div className="bg-red-500/20 p-2 rounded-full flex-shrink-0 animate-pulse">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="flex flex-col w-full flex-1">
              <div className="flex justify-between items-start w-full mb-1">
                <span className="font-cyber text-red-400 font-bold tracking-wide uppercase text-sm mt-1">
                  ด่วน! แจ้งเตือนน้ำท่วมปราจีนบุรี
                </span>
                {currentDisplay?.timeAgo && (
                  <span className="text-slate-400 text-xs font-body bg-slate-800 px-2 py-1 rounded-md border border-slate-700 ml-2 whitespace-nowrap shadow-inner">
                    {currentDisplay.timeAgo}
                  </span>
                )}
              </div>
              
              {currentDisplay && (
                <>
                  <h3 className="font-body text-white font-bold text-lg leading-tight mb-2 pr-4">
                    {currentDisplay.title}
                  </h3>
                  <p className="font-body text-slate-300 text-sm mb-3">
                    {currentDisplay.body}
                  </p>
                  
                  {/* Credit Text */}
                  <div className="mt-auto border-t border-slate-700/50 pt-2 flex items-center justify-end gap-1">
                    <span className="text-[10px] text-slate-500 font-body uppercase tracking-wider">
                      ข้อมูลจาก
                    </span>
                    <span className="text-[10px] text-sky-400/80 font-cyber font-medium tracking-wide">
                      prachin.space
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default PrachinAlertWidget;

import { useEffect, useState } from 'react';

export const EmergencyAlertWidget = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in effect on mount
    setTimeout(() => {
      setIsVisible(true);
    }, 500);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'transparent', position: 'relative' }}>
      <div 
        className={`absolute bottom-10 left-10 max-w-2xl w-full transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="bg-red-900/90 backdrop-blur-md border-l-8 border-l-red-500 rounded-lg p-5 shadow-[0_0_40px_rgba(239,68,68,0.5)] border border-red-500/50 relative overflow-hidden">
          
          {/* Flashing Alert Indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>

          <div className="flex items-start gap-4">
            {/* Warning Icon */}
            <div className="bg-red-500 p-3 rounded-full flex-shrink-0 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="flex flex-col w-full flex-1">
              <div className="flex justify-between items-start w-full mb-1">
                <span className="font-cyber text-red-100 font-bold tracking-widest uppercase text-base mt-1 drop-shadow-md">
                  ปภ.เตือนน้ำท่วม
                </span>
                <span className="text-red-200 text-xs font-body bg-red-950/80 px-2 py-1 rounded-md border border-red-800 ml-2 shadow-inner">
                  27-09-2026 16:53:18
                </span>
              </div>
              
              <p className="font-body text-white font-medium text-[15px] leading-relaxed mt-2 text-justify">
                เกิดน้ำท่วมในพื้นที่ จ.ปราจีนบุรี มีบ้านเรือนได้รับผลกระทบ 4,100 หลัง และระดับน้ำในแม่น้ำปราจีนบุรียังคงเพิ่มสูงขึ้นต่อเนื่อง คาดว่าจะสูงขึ้นอีกประมาณ 1 เมตร โดยเฉพาะ ในเขตเทศบาลเมืองปราจีนบุรี อ.ศรีมหาโพธิ อ.นาดี อ.กบินทร์บุรี และพื้นที่ใกล้เคียง 
                <br/><br/>
                <span className="text-yellow-300 font-bold drop-shadow-sm">ขอให้ผู้ที่อาศัยริมแม่น้ำ/ที่ลุ่มต่ำ/พื้นที่เสี่ยง ยกของขึ้นที่สูงทันที เคลื่อนย้ายรถทันที เก็บทรัพย์สินมีค่าและเอกสารสำคัญ ระวังไฟฟ้าดูด เคลื่อนย้ายกลุ่มเปราะบาง อพยพไปยังศูนย์พักพิงทันที</span> 
                <br/><br/>
                หากต้องการความช่วยเหลือให้แจ้งกำนัน ผู้ใหญ่บ้าน หรือผู้นำชุมชน
              </p>
              
              {/* Credit Text */}
              <div className="mt-4 border-t border-red-500/30 pt-2 flex items-center justify-end gap-1">
                <span className="text-[10px] text-red-300 font-body uppercase tracking-wider">
                  ข้อมูลจาก
                </span>
                <span className="text-[11px] text-white font-cyber font-bold tracking-wide">
                  DDPM
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlertWidget;

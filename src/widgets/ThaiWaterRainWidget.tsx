import { useState, useEffect } from 'react';

export const ThaiWaterRainWidget = () => {
  const [data, setData] = useState<any>(null);
  const [province, setProvince] = useState('ปราจีนบุรี');

  useEffect(() => {
    // Check URL params for province
    const params = new URLSearchParams(window.location.search);
    if (params.get('province')) {
      setProvince(params.get('province')!);
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/thaiwater-rain?_t=${Date.now()}`);
        if (!res.ok) return;
        
        const json = await res.json();
        if (json && json.data) {
          // Filter for province
          const provinceData = json.data.filter((item: any) => 
            item.province_name?.th === province || 
            item.geocode?.province_name?.th === province
          );
          
          if (provinceData.length > 0) {
            // Find max rainfall in this province
            const maxRain = provinceData.reduce((prev: any, current: any) => 
              (prev.rain_24h > current.rain_24h) ? prev : current
            );
            setData(maxRain);
          }
        }
      } catch (err) {
        console.error('Error fetching ThaiWater data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 mins
    return () => clearInterval(interval);
  }, [province]);

  if (!data) return null;

  // Determine severity based on rain amount (criteria roughly matching ThaiWater)
  // 0 = no rain, >0-10 = light, >10-35 = moderate, >35-90 = heavy, >90 = very heavy
  let severityLabel = 'ฝนตกเล็กน้อย';
  let severityColor = 'bg-green-500';
  let boxBg = 'bg-green-500/10';
  
  if (data.rain_24h > 90) {
    severityLabel = 'ฝนหนักมาก';
    severityColor = 'bg-red-600';
    boxBg = 'bg-red-500/10';
  } else if (data.rain_24h > 35) {
    severityLabel = 'ฝนตกหนัก';
    severityColor = 'bg-orange-500';
    boxBg = 'bg-orange-500/10';
  } else if (data.rain_24h > 10) {
    severityLabel = 'ฝนปานกลาง';
    severityColor = 'bg-yellow-500';
    boxBg = 'bg-yellow-500/10';
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'transparent', padding: '20px' }}>
      
      {/* The White Card from screenshot */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 max-w-sm font-body">
        <h2 className="text-xl font-bold text-slate-800 mb-1">ข้อมูลล่าสุด ({province})</h2>
        <p className="text-sm text-slate-500">ล่าสุด: {data.rainfall_datetime}</p>
        <p className="text-sm text-slate-500 mb-4">ข้อมูล: {data.agency?.agency_name?.th || 'กรมอุตุนิยมวิทยา'}</p>

        {/* Pink/Colored Box */}
        <div className={`${boxBg} rounded-xl p-4 border border-slate-100`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-slate-700">ฝนสะสม 24 ชม.</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{severityLabel}</span>
              <div className="flex gap-1">
                {/* 7 squares representing severity */}
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-[2px] ${data.rain_24h > (i * 15) ? severityColor : 'bg-slate-200'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-5xl font-bold text-slate-900">{data.rain_24h.toFixed(1)}</span>
            <span className="text-lg font-medium text-slate-700">มม.</span>
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default ThaiWaterRainWidget;

import { useEffect, useState } from 'react';

// Custom Hook to fetch graph data for a specific station
function useWaterlevelGraph(stationId?: number | string, stationType?: string) {
  const [points, setPoints] = useState<number[]>([]);
  
  useEffect(() => {
    if (!stationId || !stationType) return;
    
    let isMounted = true;
    const now = new Date();
    const past = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    
    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const startDate = fmt(past);
    const endDate = fmt(now);

    const fetchGraph = async () => {
      try {
        const url = `/api/thaiwater-waterlevel-graph?station_type=${stationType}&station_id=${stationId}&start_date=${startDate}&end_date=${endDate}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        
        if (isMounted && json?.data?.graph_data) {
          const values = json.data.graph_data
            .map((d: any) => d.value !== null ? Number(d.value) : null)
            .filter((v: any) => v !== null && !isNaN(v));
          setPoints(values);
        }
      } catch (err) {
        console.error('Error fetching graph', err);
      }
    };
    
    fetchGraph();
    
    return () => { isMounted = false; };
  }, [stationId, stationType]);
  
  return points;
}

// Sparkline Component
const Sparkline = ({ data, colorClass }: { data: number[], colorClass: string }) => {
  if (data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  // SVG dimensions
  const width = 300;
  const height = 40;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // SVG Polygon for fill under the line
  const polygonPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="w-full mt-3 opacity-90">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10 overflow-visible">
        {/* Fill */}
        <polygon points={polygonPoints} className={`fill-current opacity-10 ${colorClass}`} />
        {/* Line */}
        <polyline points={points} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`stroke-current ${colorClass}`} />
      </svg>
      <div className="flex justify-between text-[8px] text-slate-500 mt-1 uppercase">
        <span>3 วันที่แล้ว</span>
        <span>ปัจจุบัน</span>
      </div>
    </div>
  );
};

export const ThaiWaterLevelWidget = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [stationList, setStationList] = useState<string[]>(['ปราจีนบุรี']);
  const [province, setProvince] = useState<string>('ปราจีนบุรี');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stations')) {
      setStationList(params.get('stations')!.split(',').map(s => s.trim()));
    } else if (params.get('station')) {
      setStationList([params.get('station')!]);
    }
    if (params.get('province')) setProvince(params.get('province')!);

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/thaiwater-waterlevel?_t=${Date.now()}`);
        if (!res.ok) return;
        
        const json = await res.json();
        const waterDataList = json.waterlevel_data?.data || json.data;
        if (waterDataList && Array.isArray(waterDataList)) {
          setDataList(waterDataList);
        }
      } catch (err) {
        console.error('Error fetching ThaiWater water level:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Fetch every 5 mins
    return () => clearInterval(interval);
  }, []);

  // Rotate stations
  useEffect(() => {
    if (stationList.length <= 1) return;
    const rotateInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % stationList.length);
    }, 15000); // Rotate every 15 seconds
    return () => clearInterval(rotateInterval);
  }, [stationList]);

  if (dataList.length === 0) {
    return (
      <div className="w-screen h-screen flex items-center justify-center font-body text-white">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-white/20 shadow-2xl backdrop-blur-md flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <span>กำลังโหลดข้อมูลระดับน้ำ...</span>
        </div>
      </div>
    );
  }

  const currentStationName = stationList[currentIndex];
  let data = dataList.find((item: any) => 
    item.station?.tele_station_name?.th?.includes(currentStationName)
  );

  // Fallback if not found
  if (!data) {
    const provinceData = dataList.filter((item: any) => 
      item.geocode?.province_name?.th === province
    );
    if (provinceData.length > 0) {
      data = provinceData.reduce((prev: any, current: any) => 
        (Number(prev.storage_percent || 0) > Number(current.storage_percent || 0)) ? prev : current
      );
    } else {
      return (
        <div className="w-screen h-screen flex items-center justify-center font-body text-white">
          <div className="bg-red-900/80 p-4 rounded-xl border border-red-500/50 shadow-2xl backdrop-blur-md">
            <span>ไม่พบข้อมูลสถานี: {currentStationName}</span>
          </div>
        </div>
      );
    }
  }

  // Fetch graph data using our custom hook
  const graphPoints = useWaterlevelGraph(data.station?.id, data.station_type);

  // Determine situation level (1=Normal, 2=Watch, 3=Warning, 4=Critical, 5=Overflow)
  let severityLabel = 'ระดับน้ำ ปกติ';
  let severityColor = 'bg-green-500';
  let boxBg = 'bg-green-500/10';
  let graphColorClass = 'text-green-400';
  
  if (data.situation_level === 5 || data.diff_wl_bank_text?.includes('ล้นตลิ่ง') || Number(data.storage_percent) >= 100) {
    severityLabel = 'ระดับน้ำ ล้นตลิ่ง';
    severityColor = 'bg-red-600';
    boxBg = 'bg-red-500/10';
    graphColorClass = 'text-red-500';
  } else if (data.situation_level === 4) {
    severityLabel = 'ระดับน้ำ วิกฤติ';
    severityColor = 'bg-orange-500';
    boxBg = 'bg-orange-500/10';
    graphColorClass = 'text-orange-400';
  } else if (data.situation_level === 3) {
    severityLabel = 'ระดับน้ำ เฝ้าระวัง';
    severityColor = 'bg-yellow-500';
    boxBg = 'bg-yellow-500/10';
    graphColorClass = 'text-yellow-400';
  } else if (data.situation_level === 2) {
    severityLabel = 'ระดับน้ำ น้ำมาก';
    severityColor = 'bg-blue-500';
    boxBg = 'bg-blue-500/10';
    graphColorClass = 'text-blue-400';
  }

  // Handle format for display
  const waterLevel = data.waterlevel_msl || data.waterlevel_m || '0.00';
  const percentage = data.storage_percent ? `(${Number(data.storage_percent).toFixed(0)}%)` : '';
  const stationDisplayName = data.station?.tele_station_name?.th || currentStationName;
  const provinceDisplayName = data.geocode?.province_name?.th || province;

  // Calculate change
  let changeElement = null;
  const currentVal = Number(data.waterlevel_msl || data.waterlevel_m || 0);
  const prevVal = Number(data.waterlevel_msl_previous || data.waterlevel_m_previous || currentVal);
  if (currentVal !== prevVal && prevVal !== 0) {
    const diff = currentVal - prevVal;
    const isPositive = diff > 0;
    const diffText = `${isPositive ? '+' : ''}${diff.toFixed(2)}%`;
    const diffColor = isPositive ? 'text-green-400 bg-green-500/20 border border-green-500/30' : 'text-red-400 bg-red-500/20 border border-red-500/30';
    const arrow = isPositive ? '↑' : '↓';
    
    changeElement = (
      <span className={`ml-auto flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold ${diffColor}`}>
        {arrow} {diffText}
      </span>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'transparent', padding: '20px' }}>
      
      <style>
        {`
          @keyframes slideFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      
      {/* The Glassy Card */}
      <div 
        key={currentStationName} 
        className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 max-w-sm font-body text-white"
        style={{ animation: 'slideFadeIn 0.5s ease-out' }}
      >
        
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full ${boxBg.replace('/10', '/30')} border border-white/10 flex items-center justify-center`}>
            <svg className={`w-5 h-5 ${severityColor.replace('bg-', 'text-').replace('600', '400')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14.5a3 3 0 013-3 3 3 0 013 3 3 3 0 013-3 3 3 0 013 3M4 19a3 3 0 013-3 3 3 0 013 3 3 3 0 013-3 3 3 0 013 3M20 9.5a3 3 0 00-3-3 3 3 0 00-3-3 3 3 0 00-3-3 3 3 0 00-3-3" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">{stationDisplayName}</h2>
            <p className="text-xs text-slate-300">{provinceDisplayName}</p>
          </div>
        </div>

        {/* Colored Box */}
        <div className={`bg-slate-800/80 rounded-xl p-3 border border-white/10 mb-3`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-300">ระดับน้ำ</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${data.situation_level === 5 || Number(data.storage_percent) >= 100 ? 'text-red-400' : 'text-white'}`}>{severityLabel.replace('ระดับน้ำ ', '')}</span>
              <div className="flex gap-1">
                {/* 5 squares for water level severity */}
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-sm ${data.situation_level >= (i + 1) ? severityColor.replace('600', '500') : 'bg-slate-600'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center mt-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-extrabold tracking-tight ${data.situation_level === 5 || Number(data.storage_percent) >= 100 ? 'text-red-400' : 'text-white'}`}>{waterLevel}</span>
              <span className={`text-xl font-bold ${data.situation_level === 5 || Number(data.storage_percent) >= 100 ? 'text-red-400/90' : 'text-white/80'}`}>{percentage}</span>
            </div>
            {changeElement}
          </div>
          
          {/* SVG Sparkline Graph Component */}
          <Sparkline data={graphPoints} colorClass={graphColorClass} />
          
          <p className="text-slate-400 mt-2 text-[10px] uppercase tracking-wide">ม.รทก. / % ม.รทก</p>
        </div>
        
        {/* Footer */}
        <div className="flex flex-col border-t border-white/10 pt-2">
           <span className="text-[10px] text-slate-300 font-medium leading-tight">{data.agency?.agency_name?.th || 'กรมชลประทาน'}</span>
           <span className="text-[10px] text-slate-400 mt-0.5">{data.waterlevel_datetime}</span>
        </div>
        
      </div>
      
    </div>
  );
};

export default ThaiWaterLevelWidget;

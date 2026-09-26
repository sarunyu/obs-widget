import { useState, useEffect } from 'react';

export const ThaiWaterLevelWidget = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [stationList, setStationList] = useState<string[]>(['สะพานณรงค์ดำริ', 'เมืองปราจีนบุรี']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [province, setProvince] = useState('ปราจีนบุรี');

  // Fetch data
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

  if (dataList.length === 0) return null;

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
      return null;
    }
  }

  // Determine situation level (1=Normal, 2=Watch, 3=Warning, 4=Critical, 5=Overflow)
  let severityLabel = 'ระดับน้ำ ปกติ';
  let severityColor = 'bg-green-500';
  let boxBg = 'bg-green-500/10';
  
  if (data.situation_level === 5 || data.diff_wl_bank_text?.includes('ล้นตลิ่ง')) {
    severityLabel = 'ระดับน้ำ ล้นตลิ่ง';
    severityColor = 'bg-red-600';
    boxBg = 'bg-red-500/10';
  } else if (data.situation_level === 4) {
    severityLabel = 'ระดับน้ำ วิกฤติ';
    severityColor = 'bg-orange-500';
    boxBg = 'bg-orange-500/10';
  } else if (data.situation_level === 3) {
    severityLabel = 'ระดับน้ำ เฝ้าระวัง';
    severityColor = 'bg-yellow-500';
    boxBg = 'bg-yellow-500/10';
  } else if (data.situation_level === 2) {
    severityLabel = 'ระดับน้ำ น้ำมาก';
    severityColor = 'bg-blue-500';
    boxBg = 'bg-blue-500/10';
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
    // Some stations might show absolute diff, some might show percentage. Let's show absolute diff since 4.25 - 4.01 = 0.24 (usually they append % incorrectly or it's percentage of capacity)
    // Actually the user's screenshot showed "+0.24%" so let's format it with + and %
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
          <p className="text-slate-400 mt-1 text-[10px] uppercase tracking-wide">ม.รทก. / % ม.รทก</p>
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

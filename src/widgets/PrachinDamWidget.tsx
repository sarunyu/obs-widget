import { useEffect, useState } from 'react';

export const PrachinDamWidget = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastAnnounced, setLastAnnounced] = useState<string | null>(null);

  const fetchDamData = async () => {
    try {
      const res = await fetch(`/api/bigdata-swoc-dam?_t=${new Date().getTime()}`);
      if (!res.ok) return;
      const json = await res.json();
      
      if (json.success && json.data) {
        const dam = json.data.find((d: any) => d.name === "เขื่อนนฤบดินทรจินดา");
        if (dam) {
          setData(dam);
        }
      }
    } catch (error) {
      console.error("Error fetching dam data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDamData();
    const interval = setInterval(fetchDamData, 5 * 60 * 1000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  // Text-to-speech for dam updates
  useEffect(() => {
    if (data && data.dam_volume !== undefined) {
       const currentVolume = String(data.dam_volume);
       if (lastAnnounced !== currentVolume) {
          const text = lastAnnounced === null
             ? `ปริมาณน้ำปัจจุบันใน${data.name} อยู่ที่ ${data.dam_volume} ล้านลูกบาศก์เมตร คิดเป็น ${data.dam_percent_storage} เปอร์เซ็นต์`
             : `อัปเดตปริมาณน้ำใน${data.name} ล่าสุดอยู่ที่ ${data.dam_volume} ล้านลูกบาศก์เมตร คิดเป็น ${data.dam_percent_storage} เปอร์เซ็นต์`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "th-TH";
          window.speechSynthesis.speak(utterance);
          setLastAnnounced(currentVolume);
       }
    }
  }, [data, lastAnnounced]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center font-body text-white">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-white/20 shadow-2xl backdrop-blur-md flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <span>กำลังโหลดข้อมูลเขื่อน...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Format date
  const dateObj = new Date(data.date);
  const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const formattedDate = `${dateObj.getDate()} ${thaiMonths[dateObj.getMonth()]} ${dateObj.getFullYear() + 543} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')} น.`;

  // Status mapping
  let statusText = "ปกติ";
  let statusColor = "bg-green-500 text-white";
  let dropShadowColor = "rgba(34,197,94,0.5)";
  
  if (data.dam_percent_storage >= 80) {
    statusText = "เกินเกณฑ์ปกติ";
    statusColor = "bg-pink-500 text-white";
    dropShadowColor = "rgba(236,72,153,0.5)";
  } else if (data.dam_percent_storage <= 30) {
    statusText = "น้ำน้อย";
    statusColor = "bg-orange-500 text-white";
    dropShadowColor = "rgba(249,115,22,0.5)";
  }

  const formatNumber = (num: number | string | null) => {
    if (num === null || num === undefined || num === '') return "ไม่ระบุ";
    return Number(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'transparent', padding: '20px' }}>
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-5 max-w-sm font-body text-white relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-sky-200 tracking-wide mb-1 bg-sky-900/40 inline-block px-3 py-1 rounded-md border border-sky-400/30">
            {data.name}
          </h2>
          <p className="text-sm text-slate-300">
            จ. {data.province} • {data.basin}
          </p>
        </div>

        {/* Percentage Badge */}
        <div className="flex justify-center mb-5">
          <div 
            className={`px-4 py-2 rounded-lg font-bold text-lg flex items-center gap-2 ${statusColor}`}
            style={{ boxShadow: `0 4px 15px ${dropShadowColor}` }}
          >
            <span className="text-2xl">{data.dam_percent_storage}%</span>
            <span className="text-sm font-medium opacity-90">({statusText})</span>
          </div>
        </div>

        {/* Data Rows */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-white/10 flex flex-col gap-2.5">
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 text-sm">ความจุ:</span>
            <span className="font-bold text-white text-sm">{formatNumber(data.dam_storage)} ล้าน ลบ.ม.</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 text-sm">ปริมาณน้ำเก็บกัก:</span>
            <span className="font-bold text-white text-sm">{formatNumber(data.dam_volume)} ล้าน ลบ.ม.</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 text-sm">ปริมาณน้ำใช้การ:</span>
            <span className="font-bold text-sky-400 text-sm">{formatNumber(data.dam_use_storage)} ล้าน ลบ.ม.</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
            <span className="text-slate-400 text-sm">ปริมาณน้ำไหลเข้า:</span>
            <span className="font-bold text-yellow-400 text-sm">{formatNumber(data.dam_inflow)} ล้าน ลบ.ม.</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">ปริมาณน้ำระบาย:</span>
            <span className="font-bold text-green-400 text-sm">{formatNumber(data.dam_outflow)} ล้าน ลบ.ม.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 font-medium">ข้อมูลอัปเดต: {formattedDate}</p>
          <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider">BIGDATA-SWOC.RID.GO.TH</p>
        </div>
      </div>
    </div>
  );
};

export default PrachinDamWidget;

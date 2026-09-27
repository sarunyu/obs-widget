const fs = require('fs');
let code = fs.readFileSync('src/widgets/ThaiWaterLevelWidget.tsx', 'utf8');

const hookCode = `
  const waterLevel = data.waterlevel_msl || data.waterlevel_m || '0.00';
  const percentage = data.storage_percent ? \`(\${Number(data.storage_percent).toFixed(0)}%)\` : '';
  const stationDisplayName = data.station?.tele_station_name?.th || currentStationName;
  const provinceDisplayName = data.geocode?.province_name?.th || province;

  // Text-to-speech for water level changes
  const [lastAnnounced, setLastAnnounced] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (data && waterLevel) {
      const stationId = data.station?.id;
      if (stationId) {
         if (lastAnnounced[stationId] !== waterLevel) {
            // Announce if it's not the first load, OR if it's explicitly wanted on first load
            // The prompt said: "ถ้าค่ามีการเปลี่ยนแปลง ให้อ่านค่าล่าสุด"
            if (lastAnnounced[stationId] !== undefined) {
               const text = \`ระดับน้ำมีการเปลี่ยนแปลง ค่าล่าสุด \${waterLevel} เมตร\`;
               const utterance = new SpeechSynthesisUtterance(text);
               utterance.lang = 'th-TH';
               window.speechSynthesis.speak(utterance);
            }
            setLastAnnounced(prev => ({...prev, [stationId]: waterLevel}));
         }
      }
    }
  }, [data?.station?.id, waterLevel]);
`;

code = code.replace(
  /const waterLevel = data\.waterlevel_msl \|\| data\.waterlevel_m \|\| '0\.00';\n\s+const percentage = data\.storage_percent \? `\(\$\{Number\(data\.storage_percent\)\.toFixed\(0\)\}% \)` : '';\n\s+const stationDisplayName = data\.station\?\.tele_station_name\?\.th \|\| currentStationName;\n\s+const provinceDisplayName = data\.geocode\?\.province_name\?\.th \|\| province;/,
  hookCode
);
// fallback if regex doesn't match perfectly due to template literal formatting
if (code.indexOf("Text-to-speech") === -1) {
  // Let's replace by simple string splitting
  let parts = code.split("const waterLevel = data.waterlevel_msl || data.waterlevel_m || '0.00';");
  if(parts.length === 2) {
    code = parts[0] + hookCode.replace("const waterLevel = data.waterlevel_msl || data.waterlevel_m || '0.00';", "") + parts[1];
  }
}

fs.writeFileSync('src/widgets/ThaiWaterLevelWidget.tsx', code);

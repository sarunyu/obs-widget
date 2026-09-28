import { DancingGirlWidget } from "./widgets/DancingGirlWidget";
import { DancingBlobWidget } from "./widgets/DancingBlobWidget";
import { ChromeDinoWidget } from "./widgets/ChromeDinoWidget";
import { RunningCatWidget } from "./widgets/RunningCatWidget";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Text3DWidget from './widgets/Text3DWidget';
import SlideTextWidget from './widgets/SlideTextWidget';
import AudioVisualizerWidget from './widgets/AudioVisualizerWidget';
import NeonAlertWidget from './widgets/NeonAlertWidget';
import PrachinAlertWidget from './widgets/PrachinAlertWidget';
import ThaiWaterRainWidget from './widgets/ThaiWaterRainWidget';
import EmergencyAlertWidget from './widgets/EmergencyAlertWidget';
import DamWidget from './widgets/DamWidget';
import ThaiWaterLevelWidget from './widgets/ThaiWaterLevelWidget';
import ControlPanel from './ControlPanel';

const Home = () => (
  <div style={{ padding: '20px', color: 'white', background: 'black', height: '100vh', boxSizing: 'border-box' }}>
    <h1>OBS Widget System</h1>
    <p>Available Pages:</p>
    <ul>
      <li>
        <Link to="/widget/prachin-dam" style={{ color: '#3388ff' }}>
          Dam: เขื่อนนฤบดินทรจินดา
        </Link>
      </li>
      <li>
        <Link to="/widget/khundan-dam" style={{ color: '#3388ff' }}>
          Dam: เขื่อนขุนด่านปราการชล
        </Link>
      </li>
      <li>
        <Link to="/widget/emergency-alert" style={{ color: '#ff3333' }}>
          Flood Emergency Alert
        </Link>
      </li>
      <li>
        <Link to="/widget/thaiwater-level" style={{ color: '#33ffaa' }}>
          ThaiWater Water Level (ระดับน้ำ)
        </Link>
      </li>
      <li>
        <Link to="/control" style={{ color: '#ff00cc' }}>
          Remote Control Panel
        </Link>
      </li>
    </ul>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/widget/text3d" element={<Text3DWidget />} />
        <Route path="/widget/slide-text" element={<SlideTextWidget />} />
        <Route path="/widget/neon-alert" element={<NeonAlertWidget />} />
        <Route path="/widget/prachin-alert" element={<PrachinAlertWidget />} />
        <Route path="/widget/thaiwater-rain" element={<ThaiWaterRainWidget />} />
        <Route path="/widget/thaiwater-level" element={<ThaiWaterLevelWidget />} />
        <Route path="/widget/emergency-alert" element={<EmergencyAlertWidget />} />
        <Route path="/widget/prachin-dam" element={<DamWidget damName="เขื่อนนฤบดินทรจินดา" />} />
        <Route path="/widget/khundan-dam" element={<DamWidget damName="เขื่อนขุนด่านปราการชล" />} />
        <Route path="/widget/thaiwater-levels" element={<ThaiWaterLevelWidget />} />
        <Route path="/widget/visualizer" element={<AudioVisualizerWidget />} />
        <Route path="/control" element={<ControlPanel />} />
        <Route path="/widget/running-cat" element={<RunningCatWidget />} />
        <Route path="/widget/chrome-dino" element={<ChromeDinoWidget />} />
        <Route path="/widget/dancing-blob" element={<DancingBlobWidget />} />
        <Route path="/widget/dancing-girl" element={<DancingGirlWidget />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

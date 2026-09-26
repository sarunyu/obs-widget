import { RunningCatWidget } from "./widgets/RunningCatWidget";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Text3DWidget from './widgets/Text3DWidget';
import SlideTextWidget from './widgets/SlideTextWidget';
import AudioVisualizerWidget from './widgets/AudioVisualizerWidget';
import NeonAlertWidget from './widgets/NeonAlertWidget';
import PrachinAlertWidget from './widgets/PrachinAlertWidget';
import ThaiWaterRainWidget from './widgets/ThaiWaterRainWidget';
import ThaiWaterLevelWidget from './widgets/ThaiWaterLevelWidget';
import ControlPanel from './ControlPanel';

const Home = () => (
  <div style={{ padding: '20px', color: 'white', background: 'black', height: '100vh', boxSizing: 'border-box' }}>
    <h1>OBS Widget System</h1>
    <p>Available Pages:</p>
    <ul>
      <li>
        <Link to="/widget/text3d" style={{ color: '#00ffcc' }}>
          3D Text Widget
        </Link>
      </li>
      <li>
        <Link to="/widget/slide-text" style={{ color: '#00ccff' }}>
          Bottom Slide Text Widget
        </Link>
      </li>
      <li>
        <Link to="/widget/neon-alert" style={{ color: '#ff00ff' }}>
          Neon Alert Overlay
        </Link>
      </li>
      <li>
        <Link to="/widget/prachin-alert" style={{ color: '#ff3333' }}>
          Prachin Flood Alerts
        </Link>
      </li>
      <li>
        <Link to="/widget/thaiwater-rain" style={{ color: '#3388ff' }}>
          ThaiWater Rain 24h (ฝนสะสม)
        </Link>
      </li>
      <li>
        <Link to="/widget/thaiwater-level" style={{ color: '#33ffaa' }}>
          ThaiWater Water Level (ระดับน้ำ)
        </Link>
      </li>
      <li>
        <Link to="/widget/visualizer" style={{ color: '#ff00cc' }}>
          Audio Visualizer Background
        </Link>
      </li>
      <li>
        <Link to="/widget/running-cat" style={{ color: "#ffaa00" }}>
          Running Cat 🐈
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
        <Route path="/widget/visualizer" element={<AudioVisualizerWidget />} />
        <Route path="/control" element={<ControlPanel />} />
        <Route path="/widget/running-cat" element={<RunningCatWidget />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

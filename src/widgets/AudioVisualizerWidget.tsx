import { useRef, useState } from 'react';

export const AudioVisualizerWidget = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const initAudio = async () => {
    try {
      setError(null);
      // Request microphone or system audio access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });

      setHasStarted(true);
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      
      // Connect the stream to the analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Configure the analyser
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);

        // Clear the canvas with a transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] * 2; // Scale the height

          // Create a gradient for the bars
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
          gradient.addColorStop(0, '#ff00cc');
          gradient.addColorStop(1, '#00ffcc');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 2;
        }
      };

      draw();
    } catch (err) {
      console.error('Error accessing audio:', err);
      setError('OBS blocked audio access. Ensure you are using localhost or HTTPS, and try adding `--use-fake-ui-for-media-stream` to OBS launch parameters.');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'transparent' }}>
      {!hasStarted && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
          <button 
            onClick={initAudio}
            style={{ padding: '15px 30px', fontSize: '24px', background: '#00ffcc', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Start Audio Visualizer
          </button>
          {error && <p style={{ color: 'red', marginTop: '20px', background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '5px' }}>{error}</p>}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
};

export default AudioVisualizerWidget;

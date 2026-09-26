import { useState, useEffect, FormEvent } from 'react';
import mqtt from 'mqtt';

export const ControlPanel = () => {
  const [text, setText] = useState('');
  const [roomId, setRoomId] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    // Generate a random room ID if one doesn't exist in local storage
    let savedRoom = localStorage.getItem('obs_room_id');
    if (!savedRoom) {
      savedRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem('obs_room_id', savedRoom);
    }
    setRoomId(savedRoom);

    // Connect to free public MQTT broker over WebSockets
    const mqttClient = mqtt.connect('wss://broker.hivemq.com:8443/mqtt');

    mqttClient.on('connect', () => {
      setStatus('Connected (Real-time)');
      setClient(mqttClient);
    });

    mqttClient.on('error', (err) => {
      setStatus(`Error: ${err.message}`);
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRoom = e.target.value.toUpperCase();
    setRoomId(newRoom);
    localStorage.setItem('obs_room_id', newRoom);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!client || !client.connected) {
      setStatus('Cannot send: Not connected');
      return;
    }

    // Publish the text to our unique topic
    const topic = `obs-widget/${roomId}`;
    client.publish(topic, JSON.stringify({ text }));
    
    setStatus('Sent instantly! ⚡');
    setTimeout(() => setStatus('Connected (Real-time)'), 2000);
  };

  const handleClear = () => {
    if (client && client.connected) {
      client.publish(`obs-widget/${roomId}`, JSON.stringify({ text: '' }));
      setText('');
      setStatus('Cleared! ⚡');
      setTimeout(() => setStatus('Connected (Real-time)'), 2000);
    }
  };

  return (
    <div style={{ padding: '40px', color: 'white', background: '#111', height: '100vh', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      <h1>OBS Remote Control Panel</h1>
      <p>Change the text displayed on your stream instantly.</p>
      
      <div style={{ marginBottom: '30px', padding: '15px', background: '#222', borderRadius: '8px', display: 'inline-block' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ccc' }}>
          <strong>Your Room ID:</strong> (Make sure OBS URL has <code>?room={roomId}</code>)
        </p>
        <input 
          type="text" 
          value={roomId} 
          onChange={handleRoomChange}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '5px', border: '1px solid #444', background: '#000', color: '#00ffcc', fontWeight: 'bold' }}
        />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Enter alert text (e.g. Username)..."
          style={{ padding: '10px', fontSize: '18px', borderRadius: '5px', border: 'none' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit"
            style={{ flex: 1, padding: '10px', fontSize: '18px', background: '#00ffcc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Trigger Widget
          </button>
          <button 
            type="button"
            onClick={handleClear}
            style={{ padding: '10px', fontSize: '18px', background: '#ff0055', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Hide
          </button>
        </div>
      </form>
      
      <p style={{ color: status.includes('Error') ? '#ff0055' : '#00ffcc', marginTop: '20px' }}>
        Status: {status}
      </p>
    </div>
  );
};

export default ControlPanel;

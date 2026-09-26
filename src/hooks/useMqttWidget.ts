import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export const useMqttWidget = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    // Get room ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    let roomId = params.get('room');
    
    // Fallback to local storage if tested locally without URL param
    if (!roomId) {
      roomId = localStorage.getItem('obs_room_id') || 'DEFAULT_ROOM';
    }

    const topic = `obs-widget/${roomId}`;
    
    const client = mqtt.connect('wss://broker.hivemq.com:8443/mqtt');

    client.on('connect', () => {
      console.log(`Connected to MQTT. Subscribing to ${topic}`);
      client.subscribe(topic);
    });

    client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        try {
          const data = JSON.parse(message.toString());
          if (data.text !== undefined) {
            setText(data.text);
          }
        } catch (e) {
          console.error("Failed to parse message", e);
        }
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return { text };
};

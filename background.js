let ws = null;
let presenceEnabled = true;

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:3020');

  ws.onopen = () => {
    console.log('✅ Connected to local WebSocket app');
  };

  ws.onmessage = (msg) => {
    console.log('📩 From server:', msg.data);
  };

  ws.onclose = () => {
    console.log('🔌 WebSocket closed, retrying in 5s...');
    setTimeout(connectWebSocket, 5000);
  };

  ws.onerror = (err) => {
    console.error('❌ WebSocket error:', err.message);
  };
}

connectWebSocket();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TOGGLE_PRESENCE') {
    presenceEnabled = message.enabled;
    console.log('🔄 Rich Presence:', presenceEnabled ? 'Bật' : 'Tắt');

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'TOGGLE_PRESENCE', enabled: presenceEnabled }));
    }
    return;
  }

  if (presenceEnabled) {
    console.log('⏩ Forwarding to WS:', message);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  } else {
    console.log('🚫 Presence đang tắt, không gửi dữ liệu');
  }
});

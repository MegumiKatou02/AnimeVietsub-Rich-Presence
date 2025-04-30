let ws = null;
let presenceEnabled = true;

chrome.storage.sync.get(['richPresenceEnabled'], function(result) {
  presenceEnabled = result.richPresenceEnabled !== undefined ? result.richPresenceEnabled : true;
  console.log('🔄 Khởi động với Rich Presence:', presenceEnabled ? 'Bật' : 'Tắt');
});

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:3020');

  ws.onopen = () => {
    console.log('✅ Connected to local WebSocket app');
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'TOGGLE_PRESENCE', enabled: presenceEnabled }));
    }
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
    setTimeout(connectWebSocket, 5000);
  };
}

connectWebSocket();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Received message:', message);
  
  if (message.type === 'TOGGLE_PRESENCE') {
    presenceEnabled = message.enabled;
    console.log('🔄 Rich Presence:', presenceEnabled ? 'Bật' : 'Tắt');

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'TOGGLE_PRESENCE', enabled: presenceEnabled }));
      console.log('📤 Sent TOGGLE_PRESENCE to server:', presenceEnabled);
    } else {
      console.error('⚠️ WebSocket chưa kết nối, không thể gửi cập nhật presence');
      connectWebSocket(); 
    }
    return;
  }

  if (presenceEnabled) {
    console.log('⏩ Forwarding to WS:', message);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error('⚠️ WebSocket chưa kết nối, không thể gửi dữ liệu');
      connectWebSocket();
    }
  } else {
    console.log('🚫 Presence đang tắt, không gửi dữ liệu');
  }
});

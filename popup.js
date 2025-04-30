chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  document.getElementById("info").textContent = "Trang hiện tại: " + tab.title;
});
  
const toggle = document.getElementById('toggle-rich-presence');
const label = document.getElementById('toggle-label');

chrome.storage.sync.get(['richPresenceEnabled'], function(result) {
  const enabled = result.richPresenceEnabled ?? true;
  toggle.checked = enabled;
  label.textContent = enabled ? 'Rich Presence: Bật' : 'Rich Presence: Tắt';
});

toggle.addEventListener('change', function() {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ richPresenceEnabled: enabled }, function() {
    label.textContent = enabled ? 'Rich Presence: Bật' : 'Rich Presence: Tắt';
    chrome.runtime.sendMessage({ type: 'TOGGLE_PRESENCE', enabled });
  });
});
  
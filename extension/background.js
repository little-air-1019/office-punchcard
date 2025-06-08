const NOTI_OPTIONS = {
  type: 'basic',
  iconUrl: 'icons/icon48.png',
  title: 'Hydration Break',
  message: 'Time to drink water or go pee!'
};

chrome.runtime.onInstalled.addListener(initAlarm);
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'update') {
    initAlarm();
  }
});

function initAlarm() {
  chrome.storage.sync.get({frequency: 60}, (data) => {
    chrome.alarms.clearAll(() => {
      chrome.alarms.create('reminder', {periodInMinutes: data.frequency});
    });
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== 'reminder') return;
  chrome.storage.sync.get({skipTimes: []}, (data) => {
    if (shouldSkip(data.skipTimes)) {
      return; // skip this reminder
    }
    chrome.notifications.create('', NOTI_OPTIONS, (id) => {
      record('drink/pee');
    });
  });
});

function shouldSkip(times) {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  return times.some(t => {
    const start = parseTime(t.start);
    const end = parseTime(t.end);
    if (end >= start) {
      return current >= start && current <= end;
    }
    // cross midnight
    return current >= start || current <= end;
  });
}

function parseTime(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

function record(type) {
  chrome.storage.sync.get({record: []}, (data) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    data.record.push({time, type, done: false});
    chrome.storage.sync.set({record: data.record});
    chrome.runtime.sendMessage({type: 'refreshRecord'});
  });
}
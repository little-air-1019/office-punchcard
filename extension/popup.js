const freqInput = document.getElementById('frequency');
const saveBtn = document.getElementById('save');
const recordList = document.getElementById('record');
const skipList = document.getElementById('skip-list');
const addSkipBtn = document.getElementById('add-skip');
const skipStart = document.getElementById('skip-start');
const skipEnd = document.getElementById('skip-end');

function load() {
  chrome.storage.sync.get(['frequency', 'record', 'skipTimes'], (data) => {
    freqInput.value = data.frequency || 60;
    (data.record || []).forEach(addRecordItem);
    updateSkipList(data.skipTimes || []);
  });
}

function addRecordItem(item) {
  const li = document.createElement('li');
  li.textContent = item.time + ' - ' + item.type;
  if (item.done) li.classList.add('done');
  li.addEventListener('click', () => {
    li.classList.toggle('done');
    item.done = !item.done;
    saveRecord();
  });
  recordList.appendChild(li);
}

function saveRecord() {
  const items = [];
  recordList.querySelectorAll('li').forEach(li => {
    items.push({
      time: li.textContent.split(' - ')[0],
      type: li.textContent.split(' - ')[1],
      done: li.classList.contains('done')
    });
  });
  chrome.storage.sync.set({record: items});
}

saveBtn.addEventListener('click', () => {
  const frequency = parseInt(freqInput.value, 10);
  chrome.storage.sync.set({frequency});
  chrome.runtime.sendMessage({type: 'update'});
});

addSkipBtn.addEventListener('click', () => {
  const start = skipStart.value;
  const end = skipEnd.value;
  if (!start || !end) return;
  chrome.storage.sync.get({skipTimes: []}, (data) => {
    data.skipTimes.push({start, end});
    chrome.storage.sync.set({skipTimes: data.skipTimes}, () => {
      updateSkipList(data.skipTimes);
      chrome.runtime.sendMessage({type: 'update'});
    });
  });
});

function updateSkipList(times) {
  skipList.innerHTML = '';
  times.forEach((t, idx) => {
    const div = document.createElement('div');
    div.textContent = t.start + ' - ' + t.end;
    const del = document.createElement('button');
    del.textContent = 'x';
    del.addEventListener('click', () => {
      times.splice(idx, 1);
      chrome.storage.sync.set({skipTimes: times}, () => {
        updateSkipList(times);
        chrome.runtime.sendMessage({type: 'update'});
      });
    });
    div.appendChild(del);
    skipList.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', load);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'refreshRecord') {
    recordList.innerHTML = '';
    chrome.storage.sync.get({record: []}, (data) => {
      data.record.forEach(addRecordItem);
    });
  }
});
// ✅ main.js - 主邏輯與初始化
import { StorageService } from './storage.js';
import { addRecordItem, saveRecord } from './record.js';
import { startReminder } from './reminder.js';
import { updateSkipList } from './skip.js';

document.addEventListener('DOMContentLoaded', async () => {
  const freqInput = document.getElementById('frequency');
  const saveBtn = document.getElementById('save');
  const recordList = document.getElementById('record');
  const skipList = document.getElementById('skip-list');
  const addSkipBtn = document.getElementById('add-skip');
  const skipStart = document.getElementById('skip-start');
  const skipEnd = document.getElementById('skip-end');

  // 載入初始資料
  const data = await StorageService.get(['frequency', 'record', 'skipTimes']);
  freqInput.value = data.frequency || 60;
  (data.record || []).forEach(item => addRecordItem(item, recordList));
  updateSkipList(skipList, data.skipTimes || []);

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  startReminder(freqInput);

  // 儲存頻率設定
  saveBtn.addEventListener('click', () => {
    const frequency = parseInt(freqInput.value, 10);
    StorageService.set({ frequency }).then(() => {
      chrome.runtime.sendMessage({ type: 'update' });
      startReminder(freqInput);
    });
  });

  // 新增跳過時段
  addSkipBtn.addEventListener('click', async () => {
    const start = skipStart.value;
    const end = skipEnd.value;
    if (!start || !end) return;

    const data = await StorageService.get({ skipTimes: [] });
    data.skipTimes.push({ start, end });
    await StorageService.set({ skipTimes: data.skipTimes });
    updateSkipList(skipList, data.skipTimes);
    chrome.runtime.sendMessage({ type: 'update' });
  });

  // 接收刷新訊息
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'refreshRecord') {
      recordList.innerHTML = '';
      StorageService.get({ record: [] }).then(data => {
        data.record.forEach(item => addRecordItem(item, recordList));
      });
    }
  });
});
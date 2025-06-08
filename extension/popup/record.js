// ✅ record.js - 負責記錄顯示與狀態切換
import { StorageService } from './storage.js';

export function addRecordItem(item, recordList) {
  const li = document.createElement('li');
  li.textContent = `${item.time} - ${item.type}`;
  if (item.done) li.classList.add('done');

  li.addEventListener('click', () => {
    li.classList.toggle('done');
    item.done = !item.done;
    saveRecord(recordList);
  });

  recordList.appendChild(li);
}

export function saveRecord(recordList) {
  const items = [];
  recordList.querySelectorAll('li').forEach(li => {
    const [time, type] = li.textContent.split(' - ');
    items.push({ time, type, done: li.classList.contains('done') });
  });
  StorageService.set({ record: items });
}
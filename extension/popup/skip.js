// ✅ skip.js - 負責 skip 時段的 UI 與刪除
import { StorageService } from './storage.js';

export function updateSkipList(skipList, times) {
  skipList.innerHTML = '';
  times.forEach((t, idx) => {
    const div = document.createElement('div');
    div.textContent = `${t.start} - ${t.end}`;
    const del = document.createElement('button');
    del.textContent = 'x';

    del.addEventListener('click', () => {
      times.splice(idx, 1);
      StorageService.set({ skipTimes: times }).then(() => {
        updateSkipList(skipList, times);
        chrome.runtime.sendMessage({ type: 'update' });
      });
    });

    div.appendChild(del);
    skipList.appendChild(div);
  });
}
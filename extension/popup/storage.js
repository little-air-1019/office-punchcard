// ✅ storage.js - 管理 chrome.storage 相關操作
export const StorageService = {
  get(keys) {
    return new Promise(resolve => chrome.storage.sync.get(keys, resolve));
  },
  set(data) {
    return new Promise(resolve => chrome.storage.sync.set(data, resolve));
  }
};
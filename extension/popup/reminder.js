// ✅ reminder.js - 負責提醒與啟動邏輯
let reminderInterval = null;

export function showReminder() {
  const message = "該打卡囉！🐶";
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(message);
      } else {
        alert(message);
      }
    });
  } else {
    alert(message);
  }
}

export function startReminder(freqInput) {
  if (reminderInterval) clearInterval(reminderInterval);
  const freq = parseInt(freqInput.value, 10) || 60;
  reminderInterval = setInterval(showReminder, freq * 60 * 1000);
}
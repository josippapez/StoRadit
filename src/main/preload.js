const { contextBridge, ipcRenderer } = require('electron');
const schedule = require('node-schedule');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send('notify', message);
    },
  },
  screenshotAPI: {
    takeScreenshot() {
      ipcRenderer.send('takeScreenshot');
    },
  },
  scheduleAPI: {
    schedule() {
      /* function for scheduling job from input every minute on Zagreb timezone */

      const rule = new schedule.RecurrenceRule();
      rule.minute = new schedule.Range(0, 59, 1);
      rule.hour = new schedule.Range(0, 23, 1);
      rule.tz = 'Europe/Zagreb';

      return schedule.scheduleJob(rule, () => {
        ipcRenderer.send('schedule');
      });
    },
  },
});

const { contextBridge, ipcRenderer } = require('electron');
const schedule = require('node-schedule');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    checkVersion() {
      ipcRenderer.send('app-version');
    },
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example', 'app-version'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example', 'app-version'];
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
    schedule(time, todo) {
      schedule.scheduleJob(time, () => {
        ipcRenderer.send('schedule', todo.name);
      });
    },
  },
});

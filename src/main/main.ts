/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Notification,
  clipboard,
  Tray,
  Menu,
  NativeImage,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    console.log('oaskdoaskdo');
    autoUpdater.checkForUpdatesAndNotify();
    console.log('aaaaaaaaaaaaaaa');
  }
}

let mainWindow: BrowserWindow | null = null;
let icon: string | NativeImage = '';
let tray: Tray;

ipcMain.on('schedule', (_, name) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: 'StoRadit',
      body: `Rok zapisa naziva ${name} je istekao.`,
      icon,
    });
    notification.show();
  }
});

ipcMain.on('app-version', (event) => {
  event.reply('app-version', { version: app.getVersion() });
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('takeScreenshot', () => {
  BrowserWindow.getFocusedWindow()
    ?.capturePage()
    .then((image) => {
      clipboard.writeImage(image);
    });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  app.setAppUserModelId('StoRadit');
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  icon = getAssetPath('icon.png');

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    minHeight: 500,
    height: 728,
    minWidth: 700,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('minimize', (event: { preventDefault: () => void }) => {
    event.preventDefault();
    mainWindow?.hide();
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (!tray) {
      tray = new Tray(getAssetPath('/icons/16x16.png'));
    }
    tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: 'Show App',
          click() {
            mainWindow?.show();
          },
        },
        {
          label: 'Quit',
          click() {
            mainWindow?.destroy();
            app.quit();
          },
        },
      ])
    );
    tray.setToolTip('StoRadit');
    tray.on('double-click', () => {
      mainWindow?.show();
    });

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.webContents.session.clearCache();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.on('minimize', (event: { preventDefault: () => void }) => {
    event.preventDefault();
    mainWindow?.hide();
  });
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow?.hide();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// Auto updater events (optional)

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});
autoUpdater.on('update-available', (ev, info) => {
  console.log('Update available.');
});
autoUpdater.on('update-not-available', (ev, info) => {
  console.log('Update not available.');
});
autoUpdater.on('error', (ev, err) => {
  console.error('Error in auto updater.');
});
autoUpdater.on('download-progress', (ev, progressObj) => {
  console.log('Download progress...', progressObj);
});
autoUpdater.on('update-downloaded', (ev, info) => {
  console.log('Update downloaded; will install in 5 seconds');
});
autoUpdater.on('update-downloaded', (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function () {
    autoUpdater.quitAndInstall();
  }, 5000);
});

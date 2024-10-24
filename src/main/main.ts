import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

// Import the crawler module using import syntax
import { startCrawl } from './crawler';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();

    if (process.env.ENABLE_CRASH_REPORT === 'true') {
      log.transports.file.level = 'error';
      process.on('uncaughtException', (error) => {
        log.error('Uncaught Exception:', error);
      });
      process.on('unhandledRejection', (reason) => {
        log.error('Unhandled Rejection:', reason);
      });
    }
  }
}

let mainWindow: BrowserWindow | null = null;
let crawlProcess: any = null; // To keep track of the child process

// Existing IPC channel for 'ipc-example'
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// New IPC handler for 'dialog:openDirectory'
ipcMain.handle('dialog:openDirectory', async () => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Output Directory',
    });

    if (result.canceled) {
      return null;
    }
    return result.filePaths;
  } catch (error: any) {
    log.error('Error opening directory dialog:', error);
    return null;
  }
});

// IPC handler to start the crawl
ipcMain.handle('start-crawl', async (event, config) => {
  if (crawlProcess) {
    event.sender.send('crawl-status', 'A crawl is already in progress.');
    return;
  }

  try {
    // Start the crawler process
    await startCrawl(config);

    event.sender.send('crawl-status', 'Crawl started successfully.');
    log.info('Crawl started successfully.');
  } catch (error: any) {
    console.error('Error starting crawl:', error);
    log.error('Error starting crawl:', error);
    event.sender.send('crawl-status', `Error starting crawl: ${error.message}`);
  }
});

// IPC handler to stop the crawl
ipcMain.handle('stop-crawl', async (event) => {
  if (crawlProcess) {
    try {
      crawlProcess.kill();
      crawlProcess = null;
      event.sender.send('crawl-status', 'Crawl stopped by user.');
      log.info('Crawl stopped by user.');
    } catch (error: any) {
      console.error('Error stopping crawl:', error);
      log.error('Error stopping crawl:', error);
      event.sender.send(
        'crawl-status',
        `Error stopping crawl: ${error.message}`
      );
    }
  } else {
    event.sender.send('crawl-status', 'No crawl is currently running.');
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name: string) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ensure this path is correct
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch((error) => {
    console.error('Failed to create window:', error);
    log.error('Failed to create window:', error);
  });

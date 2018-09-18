import { app, BrowserWindow } from 'electron'
const ipcm = require('electron').ipcMain
const initFN=require('./init.js')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minWidth:1000,
    minHeight:500,
    height: 550,
    useContentSize: true,
    width: 1000,
    autoHideMenuBar:true,
    frame:false,
    // transparent: true
  })
  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL(winURL)
  BrowserWindow.addDevToolsExtension('C:/Users/10573.DESKTOP-CTGL3BJ/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/4.1.5_0');
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

initFN.initvbs();
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
debugger
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
ipcm.on("browserFN",(event,arg)=>{
  event.sender.send('event-reply',arg)
  if(arg=="small"){
    mainWindow.minimize()
  }
  if(arg=="big"){
    debugger
    mainWindow.maximize()
  }
  if(arg=="nobig"){
    mainWindow.unmaximize();
  }
  if(arg=="off"){
    mainWindow.close()
  }
  
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */


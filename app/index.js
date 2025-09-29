const { app, BrowserWindow,Tray,Menu,nativeImage } = require('electron')
const  serverStart = require('./server/bin/www')
const path = require('path');

let tray

const iconPath = path.join(__dirname, 'logoTray.png');
const icon = nativeImage.createFromPath(iconPath);

const createWindow = () => {
    serverStart()
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    })
    win.menuBarVisible=false
    win.setIcon('logoTray.png')
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    tray=new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
    { role: 'quit' }
  ])
  tray.setContextMenu(contextMenu)
    createWindow()
})

app.on('window-all-closed', () => {
    
    // if (process.platform !== 'darwin') app.quit()
})
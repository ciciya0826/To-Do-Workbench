const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron')
const serverStart = require('./server/bin/www')
const path = require('path');

let tray
let win

const iconPath = path.join(__dirname, 'logoTray.png');
const icon = nativeImage.createFromPath(iconPath);

const createWindow = () => {
    win = new BrowserWindow({
        width: 1100,
        height: 700,
    })
    win.menuBarVisible = false
    win.setIcon('logoTray.png')
    win.loadFile('index.html')
    win.setMinimumSize(1000, 600)

    win.on('closed',()=>{
        win=null;
    })
}

app.whenReady().then(() => {
    serverStart()
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        { label:'退出待办工作台' ,role: 'quit' }
    ])
    tray.setContextMenu(contextMenu)
    tray.on("click", () => {
        if(!win||win.isDestroyed()){
            createWindow()
        }
        else{
            if (win.isVisible()) {
                win.hide();
            } 
            else {
                win.show();
            }
        }
    })
    createWindow()
})

app.on('window-all-closed', () => {

    // if (process.platform !== 'darwin') app.quit()
})
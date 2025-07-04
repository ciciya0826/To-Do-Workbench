const { app, BrowserWindow } = require('electron')
const  serverStart = require('./server/bin/www')

const createWindow = () => {
    serverStart()
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
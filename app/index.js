const { app, BrowserWindow, Tray, Menu, globalShortcut, nativeImage } = require('electron');
const path = require('path');

// 启动后端服务
const startServer = require(path.join(__dirname, 'server/bin/www'));

// 托盘图标路径
const logoPath = path.join(__dirname, 'logoTray.png');
let tray = null;
let win = null;

// 创建主窗口
function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 1000,
    minHeight: 600,
    icon: logoPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // 允许跨域
    },
  });

  // ✅ 隐藏菜单栏，但保留系统标题栏
  win.setMenuBarVisibility(false);

  win.loadFile(path.join(__dirname, 'index.html'));

  // 点击“关闭”按钮时隐藏到托盘
  win.on('close', event => {
    event.preventDefault();
    win.hide();
  });

  return win;
}

// 初始化托盘
function createTray() {
  const trayIcon = nativeImage.createFromPath(logoPath);
  tray = new Tray(trayIcon);

  // 右键菜单（只含“退出”）
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出应用', click: () => app.exit() },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('待办工作台');

  // ✅ 点击托盘图标 → 显示主窗口
  tray.on('click', () => {
    if (win) {
      if (win.isVisible()) {
        win.focus();
      } else {
        win.show();
      }
    }
  });
}

// 注册快捷键
function registerShortcuts() {
  globalShortcut.register('CommandOrControl+D', () => {
    if (win) win.webContents.openDevTools();
  });
  globalShortcut.register('CommandOrControl+R', () => {
    if (win) win.reload();
  });
}

// 应用启动逻辑
app.whenReady().then(() => {
  startServer({app}); // 启动后端服务
  win = createWindow();
  createTray();
  registerShortcuts();
});

// 不退出程序，让托盘常驻
app.on('window-all-closed', () => {});

// 清理快捷键
app.on('before-quit', () => {
  globalShortcut.unregisterAll();
});

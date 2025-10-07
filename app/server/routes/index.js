var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// Electron app 用于判断路径
const electron = require('electron');
let basePath;

// 判断是否打包
if (process.mainModule.filename.includes('app.asar')) {
  // 打包后路径：app.asar.unpacked 下的 server 文件夹
  basePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'server');
} else {
  // 开发模式
  basePath = path.join(__dirname, '..');
}

const dbPath = path.join(basePath, 'db');
const doingFile = path.join(dbPath, 'DOING.json');
const doneFile = path.join(dbPath, 'DONE.json');

// 确保数据库目录存在
if (!fsSync.existsSync(dbPath)) {
  fsSync.mkdirSync(dbPath, { recursive: true });
}

// 简单的写操作锁
const fileLocks = {
  [doingFile]: false,
  [doneFile]: false
};

async function waitForFileUnlock(filePath) {
  while (fileLocks[filePath]) {
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  fileLocks[filePath] = true;
}

function releaseFileLock(filePath) {
  fileLocks[filePath] = false;
}

function safeParse(str) {
  if (!str) return [];
  try { return JSON.parse(str); } catch { return []; }
}

// 内存缓存
let doingCache = [];
let doneCache = [];

// 初始化文件和缓存
async function ensureFile(file, cacheArray) {
  try {
    await fs.access(file);
    const content = await fs.readFile(file, 'utf8');
    cacheArray.push(...safeParse(content));
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(file, '[]', 'utf8');
    } else {
      console.error(`文件 ${file} 格式错误:`, err);
      throw err;
    }
  }
}

(async () => {
  try {
    await ensureFile(doingFile, doingCache);
    await ensureFile(doneFile, doneCache);
  } catch (err) {
    console.error('初始化文件失败:', err);
  }
})();

/* GET home page */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

// 获取任务列表
router.get('/list', async function (req, res) {
  try {
    const type = req.query.tab;
    const data = type === '0' ? doingCache : doneCache;
    res.send({ data, code: 1 });
  } catch (err) {
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 排序
router.get('/sort', async function (req, res) {
  try {
    const sortType = req.query.sort; // start / end
    const type = req.query.tab;      // 0 / 1
    const data = type === '0' ? doingCache : doneCache;
    const file = type === '0' ? doingFile : doneFile;

    // 加锁防止并发写入
    await waitForFileUnlock(file);

    // 排序缓存
    data.sort((a, b) => {
      if (sortType === 'start') {
        return Date.parse(a.startTime) - Date.parse(b.startTime);
      } else {
        return Date.parse(a.endTime || 0) - Date.parse(b.endTime || 0);
      }
    });

    // 异步写回磁盘
    fs.writeFile(file, JSON.stringify(data)).catch(console.error);

    releaseFileLock(file);

    res.send({ data, code: 1, msg: '' });
  } catch (err) {
    releaseFileLock(doingFile);
    releaseFileLock(doneFile);
    res.send({ data: '', code: 0, msg: err.message });
  }
});


// 创建任务
router.post('/create', async function (req, res) {
  try {
    await waitForFileUnlock(doingFile);

    doingCache.push(req.body);

    fs.writeFile(doingFile, JSON.stringify(doingCache)).catch(console.error);
    releaseFileLock(doingFile);

    res.send({ data: req.body, code: 1 });
  } catch (err) {
    releaseFileLock(doingFile);
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 删除任务
router.post('/remove', async function (req, res) {
  try {
    const type = req.body.tab;
    const dbFile = type === 0 ? doingFile : doneFile;
    const cache = type === 0 ? doingCache : doneCache;
    const taskID = req.body?.taskID;

    if (!taskID) return res.send({ data: '', code: 0, msg: '非法任务ID' });

    await waitForFileUnlock(dbFile);

    const index = cache.findIndex(i => i.taskID === taskID);
    if (index === -1) {
      releaseFileLock(dbFile);
      return res.send({ data: '', code: 0, msg: '任务不存在' });
    }

    cache.splice(index, 1);

    fs.writeFile(dbFile, JSON.stringify(cache)).catch(console.error);
    releaseFileLock(dbFile);

    res.send({ data: type, code: 1, msg: '' });
  } catch (err) {
    releaseFileLock(doingFile);
    releaseFileLock(doneFile);
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 编辑任务
router.post('/update', async function (req, res) {
  try {
    const updateTask = req.body;
    const taskID = req.body?.taskID;
    const status = Number(req.body.status);
    const tab = req.body.tab;

    if (!updateTask || !taskID) return res.send({ data: '', code: 0, msg: '编辑任务信息不完整' });

    const readCache = tab === 0 ? doingCache : doneCache;
    const writeCache = status === 0 ? doingCache : doneCache;
    const readFile = tab === 0 ? doingFile : doneFile;
    const writeFile = status === 0 ? doingFile : doneFile;

    if (readFile !== writeFile) {
      await waitForFileUnlock(readFile);
      await waitForFileUnlock(writeFile);
    } else {
      await waitForFileUnlock(readFile);
    }

    const index = readCache.findIndex(i => i.taskID === taskID);
    if (index === -1) throw new Error('任务不存在');

    const target = readCache[index];
    const newTask = { ...target, ...updateTask };

    if (readCache === writeCache) {
      readCache[index] = newTask;
      fs.writeFile(writeFile, JSON.stringify(writeCache)).catch(console.error);
    } else {
      readCache.splice(index, 1);
      writeCache.push(newTask);
      fs.writeFile(readFile, JSON.stringify(readCache)).catch(console.error);
      fs.writeFile(writeFile, JSON.stringify(writeCache)).catch(console.error);
    }

    if (readFile !== writeFile) {
      releaseFileLock(readFile);
      releaseFileLock(writeFile);
    } else {
      releaseFileLock(readFile);
    }

    res.send({ data: newTask, code: 1, msg: '' });
  } catch (err) {
    releaseFileLock(doingFile);
    releaseFileLock(doneFile);
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 获取任务数量
router.get('/count', async function (req, res) {
  try {
    res.send({ data: { doingCount: doingCache.length, doneCount: doneCache.length }, code: 1 });
  } catch (err) {
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 搜索任务
router.get('/search', async function (req, res) {
  try {
    const type = req.query.tab;
    const taskIDArray = req.query.searchID;
    const data = type === '0' ? doingCache : doneCache;

    const idSet = new Set(taskIDArray);
    const result = data.filter(i => idSet.has(i.taskID));

    res.send({ data: result, code: 1 });
  } catch (err) {
    res.send({ data: '', code: 0, msg: err.message });
  }
});

module.exports = router;

var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db');
const doingFile = path.join(dbPath, 'DOING.json');
const doneFile = path.join(dbPath, 'DONE.json');

// 确保数据库目录存在
if (!fsSync.existsSync(dbPath)) {
  fsSync.mkdirSync(dbPath, { recursive: true });
}

// 简单的文件锁机制，防止并发写入
const fileLocks = {
  [doingFile]: false,
  [doneFile]: false
};

// 等待文件解锁
async function waitForFileUnlock(filePath) {
  while (fileLocks[filePath]) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  fileLocks[filePath] = true;
}

// 释放文件锁
function releaseFileLock(filePath) {
  fileLocks[filePath] = false;
}

/** 确保文件存在且是合法 JSON 数组 */
async function ensureFile(file) {
  try {
    await fs.access(file);
    const content = await fs.readFile(file, 'utf8');
    // 尝试解析，不直接覆盖
    JSON.parse(content || '[]');
  } catch (err) {
    // 只有文件不存在时才创建空数组，已存在但损坏的情况保留原文件以便排查
    if (err.code === 'ENOENT') {
      await fs.writeFile(file, '[]', 'utf8');
    } else {
      console.error(`文件 ${file} 格式错误，未自动修复:`, err);
      throw new Error(`文件格式错误: ${file}`);
    }
  }
}

// 初始化时确保文件存在
(async () => {
  try {
    await ensureFile(doingFile);
    await ensureFile(doneFile);
  } catch (err) {
    console.error('初始化文件失败:', err);
  }
})();

function safeParse(str) {
  if (!str) return [];
  try { return JSON.parse(str); } catch { return []; }
}

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

// 更新任务列表
router.get('/list', async function (req, res) {
  try {
    const type = req.query.tab;
    const dbFile = type === '0' ? doingFile : doneFile;
    
    await waitForFileUnlock(dbFile);
    const content = await fs.readFile(dbFile, 'utf8');
    releaseFileLock(dbFile);
    
    res.send({ data: safeParse(content), code: 1 });
  } catch (err) {
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 排序
router.get('/sort', async function (req, res) {
  try {
    const sortType = req.query.sort;
    const type = req.query.tab;
    const dbFile = type === '0' ? doingFile : doneFile;
    
    await waitForFileUnlock(dbFile);
    const content = await fs.readFile(dbFile, 'utf8');
    const data = safeParse(content);
    
    if (sortType === 'start') {
      data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    } else {
      data.sort((a, b) =>
        new Date(a.endTime || 0).getTime() - new Date(b.endTime || 0).getTime()
      );
    }
    
    await fs.writeFile(dbFile, JSON.stringify(data));
    releaseFileLock(dbFile);
    
    res.send({ data, code: 1, msg: '' });
  } catch (err) {
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 创建任务
router.post('/create', async function (req, res) {
  try {
    await waitForFileUnlock(doingFile);
    const content = await fs.readFile(doingFile, 'utf8');
    
    const current = safeParse(content);
    const newTasks = [...current, req.body];
    await fs.writeFile(doingFile, JSON.stringify(newTasks));
    releaseFileLock(doingFile);
    
    res.send({ data: req.body, code: 1 });
  } catch (err) {
    releaseFileLock(doingFile); // 确保释放锁
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 删除任务
router.post('/remove', async function (req, res) {
  try {
    const type = req.body.tab;
    const dbFile = type === 0 ? doingFile : doneFile;
    const taskID = req.body?.taskID;
    
    if (!taskID) return res.send({ data: '', code: 0, msg: '非法任务ID' });
    
    await waitForFileUnlock(dbFile);
    const content = await fs.readFile(dbFile, 'utf8');
    const data = safeParse(content);
    
    const removeTarget = data.find(i => i.taskID === taskID);
    if (!data.length || !removeTarget) {
      releaseFileLock(dbFile);
      return res.send({ data: '', code: 0, msg: '无效' });
    }
    
    const newTasks = data.filter(i => i.taskID !== taskID);
    await fs.writeFile(dbFile, JSON.stringify(newTasks));
    releaseFileLock(dbFile);
    
    res.send({ data: type, code: 1, msg: '' });
  } catch (err) {
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

    const readFile = tab === 0 ? doingFile : doneFile;
    const writeFile = status === 0 ? doingFile : doneFile;
    
    if (!updateTask || !taskID) {
      return res.send({ data: '', code: 0, msg: '编辑任务信息不完整' });
    }

    // 加锁相关文件
    if (readFile !== writeFile) {
      await waitForFileUnlock(readFile);
      await waitForFileUnlock(writeFile);
    } else {
      await waitForFileUnlock(readFile);
    }

    // 读取源文件
    const readDataStr = await fs.readFile(readFile, 'utf8');
    const readData = safeParse(readDataStr);
    const target = readData.find(i => i.taskID === taskID);
    
    if (!target) {
      throw new Error('任务不存在');
    }

    if (status === tab) {
      // 同一状态下的更新
      const newReadTasks = [
        ...readData.filter(i => i.taskID !== taskID),
        updateTask,
      ];
      await fs.writeFile(writeFile, JSON.stringify(newReadTasks));
    } else {
      // 跨状态更新
      const writeDataStr = await fs.readFile(writeFile, 'utf8');
      const writeData = safeParse(writeDataStr);
      
      const newTask = { ...target, ...updateTask };
      const newReadTasks = readData.filter(i => i.taskID !== taskID);
      const newWriteTasks = [...writeData, newTask];
      
      await fs.writeFile(readFile, JSON.stringify(newReadTasks));
      await fs.writeFile(writeFile, JSON.stringify(newWriteTasks));
    }

    // 释放锁
    if (readFile !== writeFile) {
      releaseFileLock(readFile);
      releaseFileLock(writeFile);
    } else {
      releaseFileLock(readFile);
    }

    res.send({ data: updateTask, code: 1, msg: '' });
  } catch (err) {
    // 确保释放所有可能的锁
    releaseFileLock(doingFile);
    releaseFileLock(doneFile);
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 获取任务数量
router.get('/count', async function (req, res) {
  try {
    await waitForFileUnlock(doingFile);
    const doingDataStr = await fs.readFile(doingFile, 'utf8');
    releaseFileLock(doingFile);
    
    await waitForFileUnlock(doneFile);
    const doneDataStr = await fs.readFile(doneFile, 'utf8');
    releaseFileLock(doneFile);
    
    const doingData = safeParse(doingDataStr);
    const doneData = safeParse(doneDataStr);
    
    res.send({
      data: {
        doingCount: doingData.length,
        doneCount: doneData.length,
      },
      code: 1,
    });
  } catch (err) {
    res.send({ data: '', code: 0, msg: err.message });
  }
});

// 搜索
router.get('/search', async function (req, res) {
  try {
    const type = req.query.tab;
    const taskIDArray = req.query.searchID;
    const dbFile = type === '0' ? doingFile : doneFile;
    
    await waitForFileUnlock(dbFile);
    const content = await fs.readFile(dbFile, 'utf8');
    releaseFileLock(dbFile);
    
    const data = safeParse(content).filter(i => taskIDArray.includes(i.taskID));
    res.send({ data, code: 1 });
  } catch (err) {
    res.send({ data: '', code: 0, msg: err.message });
  }
});

module.exports = router;

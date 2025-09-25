var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//更新任务列表
router.get('/list', function (req, res, next) {
  const type = req.query.tab;
  const dbPath = path.join(__dirname, '..', 'db')
  const dbFile = type === '0' ? `${dbPath}\\DOING.json` : `${dbPath}\\DONE.json`
  fs.readFile(dbFile, 'utf8', (rerr, content) => {
    if (rerr) { //读文件错误
      res.send({
        data: '',
        code: 0,
        msg: rerr
      })
      return;
    }
    res.send({
      data: JSON.parse(content),
      code: 1,
    });
  });
});

//排序
router.get('/sort', function (req, res, next) {
  // console.log('req',req.query)
  const sortType = req.query.sort;  //排序方式
  const type = req.query.tab;
  const dbPath = path.join(__dirname, '..', 'db')
  const dbFile = type === '0' ? `${dbPath}\\DOING.json` : `${dbPath}\\DONE.json`
  fs.readFile(dbFile, 'utf8', (rerr, content) => {
    if (rerr) { //读文件错误
      res.send({
        data: '',
        code: 0,
        msg: rerr
      })
      return;
    }
    // console.log('sortType', sortType);
    const data = JSON.parse(content);
    // console.log('before',data);
    if (sortType === 'start') {
      data.sort((a, b) => {
        const sa = a.startTime
        const sb = b.startTime
        return new Date(sa).getTime() - new Date(sb).getTime();
      });
      // console.log('after',data);
    } else {
      data.sort((a, b) => {
        const sa = a.endTime?.valueOf() ?? 0
        const sb = b.endTime?.valueOf() ?? 0
        return new Date(sa).getTime() - new Date(sb).getTime();
      });
    }
    const newContent=JSON.stringify(data);
    fs.writeFile(dbFile, newContent, werr => {
      if (werr) {
        res.send({
          data: '',
          code: 0,
          msg: werr
        })
        return;
      }
      res.send({
        data: data,
        code: 1,
        msg: ''
      });
    });
  });
});

//创建任务
router.post('/create', function (req, res, next) {
  const dbFile = path.join(__dirname, '..', 'db', 'DOING.json')
  fs.readFile(dbFile, 'utf8', (rerr, data) => {
    if (rerr) { //读文件错误
      res.send({
        data: '',
        code: 0,
        msg: rerr
      })
      return;
    }
    let newTasks;
    if (data === null) {
      newTasks = JSON.stringify(data);
    } else {
      newTasks = JSON.stringify([...JSON.parse(data), req.body]);
    }
    fs.writeFile(dbFile, newTasks, werr => {
      if (werr) {
        res.send({
          data: '',
          code: 0,
          msg: werr
        })
        return;
      }
    });
    res.send(data);
  });

});

//删除任务  
router.post('/remove', function (req, res, next) {
  const type = req.body.tab;
  const dbPath = path.join(__dirname, '..', 'db')
  const dbFile = type === 0 ? `${dbPath}\\DOING.json` : `${dbPath}\\DONE.json`
  const taskID = req.body?.taskID;
  if (!taskID) {
    res.send({
      data: '',
      code: 0,
      msg: '非法任务ID'
    });
    return;
  }
  fs.readFile(dbFile, 'utf8', (rerr, dataStr) => {
    if (rerr) { //读文件错误
      res.send({
        data: '',
        code: 0,
        msg: rerr
      })
      return;
    }
    let newTasks;
    const data = dataStr ? JSON.parse(dataStr) : null;
    const removeTarget = data.find(i => i.taskID === taskID);
    if (data.length === 0 || !removeTarget) {
      res.send({
        data: '',
        code: 0,
        msg: '无效'
      });
      return;
    }
    newTasks = JSON.stringify(data.filter(i => i.taskID !== taskID));
    fs.writeFile(dbFile, newTasks, werr => {
      if (werr) {
        res.send({
          data: '',
          code: 0,
          msg: werr
        })
        return;
      }
      res.send({
        data: type,
        code: 1,
        msg: ''
      });
    });
  });
});

//编辑任务  tab现在在哪个列表 status写入哪个文件
router.post('/update', function (req, res, next) {
  const doingFile = path.join(__dirname, '..', 'db', 'DOING.json')
  const doneFile = path.join(__dirname, '..', 'db', 'DONE.json')
  const updateTask = req.body;
  const taskID = req.body?.taskID;
  const finishTime = req.body.finishTime;
  const status = Number(req.body.status);
  const tab = req.body.tab;
  const readFile = tab === 0 ? doingFile : doneFile;  //要读的文件
  const writeFile = status === 0 ? doingFile : doneFile;  //要写入的文件
  // console.log('stasus',status);
  // console.log('tab',tab);
  if (!updateTask) {
    res.send({
      data: '',
      code: 0,
      msg: '编辑任务为空'
    });
    return;
  }
  fs.readFile(readFile, 'utf8', (rerr, readDataStr) => {
    if (rerr) { //读文件错误
      res.send({
        data: '',
        code: 0,
        msg: rerr
      })
      return;
    }
    const readData = readDataStr ? JSON.parse(readDataStr) : null;
    const target = readData.find(i => i.taskID === taskID); //找到点击的任务
    // console.log('readData',readData);
    // console.log('readData.lengtn',readData.length);
    // console.log('target',target);
    if (readData.length === 0 || !target) {
      res.send({
        data: '',
        code: 0,
        msg: '任务错误'
      });
      return;
    }
    let newReadTasks, newWriteTasks;
    //编辑栏
    if (status === tab) {
      newReadTasks = readData.filter(i => i.taskID !== taskID)
      newReadTasks = JSON.stringify([...newReadTasks, updateTask]);
      fs.writeFile(writeFile, newReadTasks, werr => {
        if (werr) {
          res.send({
            data: '',
            code: 0,
            msg: werr
          })
          return;
        }
        res.send({
          data: newReadTasks,
          code: 1,
          msg: ''
        });
      });
    } else {  //完成栏
      fs.readFile(writeFile, 'utf8', (rerr, writeDataStr) => {
        if (rerr) { //读文件错误
          res.send({
            data: '',
            code: 0,
            msg: rerr
          })
          return;
        }
        const writeData = JSON.parse(writeDataStr);
        let newTask;
        newTask = readData.find(i => i.taskID === taskID);
        newTask = Object.assign(newTask, updateTask);
        newReadTasks = JSON.stringify(readData.filter(i => i.taskID !== taskID));
        writeData.push(newTask);
        newWriteTasks = JSON.stringify(writeData);
        fs.writeFile(readFile, newReadTasks, werr => {
          if (werr) {
            res.send({
              data: '',
              code: 0,
              msg: werr
            })
            return;
          }
        });
        // console.log('readFile',readFile);
        // console.log('writeFile',writeFile);
        fs.writeFile(writeFile, newWriteTasks, werr => {
          if (werr) {
            res.send({
              data: '',
              code: 0,
              msg: werr
            })
            return;
          }
          res.send({
            data: newWriteTasks,
            code: 1,
            msg: ''
          });
        });
      });
    }
  });
});

//获取任务数量
router.get('/count', function (req, res, next) {
  const doingFile = path.join(__dirname, '..', 'db', 'DOING.json')
  const doneFile = path.join(__dirname, '..', 'db', 'DONE.json')
  fs.readFile(doingFile, 'utf8', (rerr, doingDataStr) => {
    if (rerr) { //读文件错误
      res.send({
        data: '',
        code: 0,
        msg: rerr
      })
      return;
    }
    const doingData = doingDataStr ? JSON.parse(doingDataStr) : null;
    fs.readFile(doneFile, 'utf8', (rerr, doneDataStr) => {
      if (rerr) { //读文件错误
        res.send({
          data: '',
          code: 0,
          msg: rerr
        })
        return;
      }
      const doneData = doneDataStr ? JSON.parse(doneDataStr) : null;
      res.send({
        data: {
          doingCount: doingData.length,
          doneCount: doneData.length
        },
        code: 1,
      });
    })
  })
});

//搜索
router.get('/search', function (req, res, next) {
  const type = req.query.tab;
  const taskIDArray=req.query.searchID;
  const dbPath = path.join(__dirname, '..', 'db')
  const dbFile = type === '0' ? `${dbPath}\\DOING.json` : `${dbPath}\\DONE.json`
  fs.readFile(dbFile, 'utf8', (rerr, content) => {
    if (rerr) { //读文件错误
      res.send({
        data: '',
        code: 0,
        msg: rerr
      })
      return;
    }
    const data=JSON.parse(content).filter(i=>taskIDArray.includes(i.taskID));
    res.send({
      data: data,
      code: 1,
    });
  });
});

module.exports = router;

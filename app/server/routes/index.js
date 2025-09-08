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
  const type=req.query.tab;
  console.log('type=',type)
  const dbPath=path.join(__dirname, '..', 'db')
  const dbFile = type==='0' ? `${dbPath}\\DOING.json` : `${dbPath}\\DONE.json`
  // const dbPath=path.join(__dirname, '..', 'db')
  // const dbFile = req.query===0 ? path.join(dbPath,'DOING.json'):path.join(dbPath,'DONE.json');
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
  // res.send({
  //   data: 'get post \'create\' ',
  // });
});

//删除任务  
router.post('/remove', function (req, res, next) {
  const dbFile = path.join(__dirname, '..', 'db', 'DOING.json')
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
        data: newTasks,
        code: 1,
        msg: ''
      });
    });
  });
});

//编辑任务
router.post('/update', function (req, res, next) {
  const doingFile = path.join(__dirname, '..', 'db', 'DOING.json')
  const doneFile = path.join(__dirname, '..', 'db', 'DONE.json')
  const updateTask = req.body;
  const taskID = req.body?.taskID;
  if (!updateTask) {
    res.send({
      data: '',
      code: 0,
      msg: '编辑任务为空'
    });
    return;
  }
  fs.readFile(doingFile, 'utf8', (rerr, doingDataStr) => {
    if (rerr) { //读文件错误
      res.send({
        data: '',
        code: 0,
        msg: rerr
      })
      return;
    }
    let newDoingTasks, newDoneTasks;
    const doingData = doingDataStr ? JSON.parse(doingDataStr) : null;
    const target = doingData.find(i => i.taskID === taskID); //找到点击的任务
    if (doingData.length === 0 || !target) {
      res.send({
        data: '',
        code: 0,
        msg: '任务错误'
      });
      return;
    }
    if (updateTask.status === 0) {
      newDoingTasks = doingData.filter(i => i.taskID !== taskID)
      newDoingTasks = JSON.stringify([...newDoingTasks, updateTask]);
      fs.writeFile(doingFile, newDoingTasks, werr => {
        if (werr) {
          res.send({
            data: '',
            code: 0,
            msg: werr
          })
          return;
        }
        res.send({
          data: newDoingTasks,
          code: 1,
          msg: ''
        });
      });
    } else {
      fs.readFile(doneFile, 'utf8', (rerr, doneDataStr) => {
        if (rerr) { //读文件错误
          res.send({
            data: '',
            code: 0,
            msg: rerr
          })
          return;
        }
        const doneData = JSON.parse(doneDataStr);
        const newTask=doingData.find(i=>i.taskID===taskID);
        newDoingTasks = JSON.stringify(doingData.filter(i => i.taskID !== taskID));
        doneData.push(newTask);
        newDoneTasks = JSON.stringify(doneData);
        fs.writeFile(doingFile, newDoingTasks, werr => {
          if (werr) {
            res.send({
              data: '',
              code: 0,
              msg: werr
            })
            return;
          }
        });
        fs.writeFile(doneFile, newDoneTasks, werr => {
          if (werr) {
            res.send({
              data: '',
              code: 0,
              msg: werr
            })
            return;
          }
          res.send({
            data: newDoneTasks,
            code: 1,
            msg: ''
          });
        });
      });
    }
  });
});

module.exports = router;

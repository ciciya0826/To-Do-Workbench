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
  const dbFile = path.join(__dirname, '..', 'db', 'DOING.json')
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
    if(data.length===0 || !removeTarget){
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

module.exports = router;

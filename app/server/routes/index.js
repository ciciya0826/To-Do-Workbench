var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

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
      newTasks = JSON.stringify([...JSON.parse(data),req.body]);
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

module.exports = router;

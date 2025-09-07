var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//解决跨域问题
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8000',  // 允许的前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // 允许的方法
  allowedHeaders: ['Content-Type', 'Authorization'],  // 允许的请求头
  exposedHeaders: ['myHeader'],  // 暴露的自定义响应头
  credentials: true // 如果需要携带 cookie
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  
});

app.put('/list',(res,req) => {
    req.header('Access-Control-Allow-Origin','http://127.0.0.1:5500')
    req.header('Access-Control-Expose-Headers', '*');
    req.header('myHeader',"hello world")
    req.send(listData)
})

module.exports = app;

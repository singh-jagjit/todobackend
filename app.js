var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var taskRouter = require('./routes/taskRouter');

var config = require('./config');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url,{ useUnifiedTopology: true, useNewUrlParser: true });

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log("Could not connect to server\n"+err); });


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));



// view engine setup
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');

//app.use('/', taskRouter);
//app.use('/users', usersRouter);

app.get('/list', (req, res, next) => {
  Task.find() 
  .then((tasks) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(tasks);
      res.render('todoview');
  }, (err) => next(err))
  .catch((err) => next(err));
});

app.post('/add', (req,res)=>{
var taskData = req.body;
var task = new Task(taskData);
task.save((err , regtask) =>{
  if(err){
    console.log(err);
  }
  else{
    res.status(200).send(regtask);
  }
  })
});


const cron = require('node-cron');
const Task = require('./models/task');
//var alltasks;

cron.schedule("* * * * * *", function(){
  //console.log("Script running.")
  Task.find() 
  .then((tasks) => {
    //console.log(tasks);
    tasks.forEach( task => {
      
      var dt = task.createdAt;
      dt.setMinutes( dt.getMinutes() + task.duration );

      var dN = new Date();

      if(dN.getTime() > dt.getTime()){
        Task.findByIdAndRemove(task._id)
        .then((resp) => {
          console.log("Item deleted: "+resp);
      }, (err) => next(err))
      .catch((err) => console.log(err));
      }
      
    })
  }, (err) => next(err))
  .catch((err) => console.log(err));
},{
  timezone: "Asia/Kolkata"
})

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

module.exports = app;

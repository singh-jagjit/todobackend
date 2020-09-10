var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const Task = require('../models/task');

router.get('/list', (req, res, next) => {
    Task.find() 
    .then((tasks) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tasks);
        res.render('todo',{ })
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/add', (req,res)=>{
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

module.exports = router;

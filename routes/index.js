'use strict';
var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var util = require('util');

var users = require('../controllers/users_c');

router.get('/', function(req, res){
  // 是否登录一般都是这么判断的
  if(req.session.user){
    res.render('index', {
      username: req.session.username,
      msg: req.session.msg
    })
  }else{
    req.session.msg = 'access denied';
    res.redirect('/login');
  }
});

router.get('/user', function(req, res){
 // 是否登录一般都是这么判断的
 if(req.session.user){
   console.log(util.inspect({msg : req.session.msg}));
   res.render('user', {
     msg: req.session.msg
   })
 }else{
   req.session.msg = 'access denied';
   res.redirect('/login');
 }
});

router.get('/signup', function(req, res){
 // 是否登录一般都是这么判断的
 if(req.session.user){
   res.redirect('/');
 }else{
   res.render('signup', {
     msg: req.session.msg
   })      
 }
});

router.get('/login', function(req, res){
 // 是否登录一般都是这么判断的
 if(req.session.user){
   res.redirect('/');
 }else{
   res.render('login', {
     msg: req.session.msg
   })      
 }
});

router.get('/logout', function(req, res){
 req.session.destroy(function(){
   res.redirect('/login');
 })
});

router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);

module.exports = router;

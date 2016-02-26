var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var util = require('util');

function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

// 感觉这里没加next的错误处理
exports.signup = function(req, res){
  var user = new User({username: req.body.username});
  user.set('hashed_password', hashPW(req.body.password));
  user.set('email', req.body.email);
  user.save(function(err){
    if(err){
      req.session.error = err;
      res.redirect('/signup');
    }else{
      req.session.user = user.id;
      req.session.username = user.username,
      req.session.msg = 'auth as '+user.username,
      res.redirect('/');
    }
  });
};

exports.login = function(req, res){
  User.findOne({username: req.body.username})
    .exec(function(err, user){
      if(!user){
        err = 'user not found';
      }else if(user.hashed_password === hashPW(req.body.password.toString())){
        req.session.regenerate(function(){
          req.session.user = user.id;
          req.session.username = user.username;
          req.session.msg = 'auth as '+user.username; 
          res.redirect('/');
        })
      }else{
        err = 'auth failed';
      }

      if(err){
        req.session.regenerate(function(){
          req.session.msg = err; 
          res.redirect('/login');
        })
      }
    })
}

exports.getUserProfile = function(req, res){
  User.findOne({_id: req.session.user})
    .exec(function(err, user){
      if(!user){
        res.json(404, {err: 'user not found'})
      }else{  
        res.json(user);
      }
    });
}

exports.updateUser = function(req, res){
  User.findOne({_id: req.session.user})
    .exec(function(err, user){
      user.set('email', req.body.email);
      user.set('color', req.body.color);
      user.save(function(err){
        if(err){
          req.session.msg = err;
        }else{
          req.session.msg = 'user update';
        }
        res.redirect('/user');
      })
    })
}

exports.deleteUser = function(req, res){
  User.findOne({_id: req.session.user})
    .exec(function(err, user){
      if(user){
        User.remove(function(err){
          if(err){
            req.session.msg = err;
          }
          req.session.destroy(function(){
            res.redirect('/login');
          })
        })
      }else{
        req.session.msg = 'user not found';
        req.session.destroy(function(){
          res.redirect('/login');
        })
      }
    })
}


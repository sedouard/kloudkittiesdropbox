/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
var express = require('express');
var router = express.Router();
var dropbox = require('dropbox-node');
var fs = require('fs');
var async = require('async');
// Upload a photo
router.post('/', function(req, res){
  
  
  fs.readFile('../bin/uploads/' + req.files.uploadImage.name, function(err, data){
    
    if(err){
      return res.send(500, err);
    }

  
    global.dboxClient.put(req.body.filename, data, function(status, reply){
      console.log(reply);
      if(status.error){
        console.log(status.error);
        return res.send(500, status.error);
      }
      
      
      return res.send(200);
    })
  });

});

// get all photos
router.get('/', function(req, res){
  console.log('debug1');
  global.dboxClient.metadata('', {root:'sandbox'}, function(status, reply){
    console.log('debug4');
    if(status.error){

      console.log(status.error);
      return res.send(500, status.error);
    }

    
    var funcs = [];
    var links = [];
    for(var i in reply.contents){
      var task = function(path, callback){
      
        global.dboxClient.media(path, function(err, data){

          if(err != 200){
            return callback(err);
          }
          console.log('executing task for file ' + path);
          links.push({
            link: data.url,
            path: path
            })
            
          callback(null);
        });
      }
      
      task = task.bind(this, reply.contents[i].path);
      
      funcs.push(task);
    }
    
    async.parallel(funcs, function(err){
      console.log('Completed all calls ' + links);
      if(err){
        return res.send(500, {message:'one or more tasks failed ' + result});
      }
      
      res.send(200, links);
    });

  });

});

module.exports = router;

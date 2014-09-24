/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>

var express = require('express');
var router = express.Router();
var dbox = require('dbox');
var dbox = require('dbox');
var dboxCli = dbox.app({ "app_key": process.env.DROPBOX_KEY, "app_secret": process.env.DROPBOX_SECRET })
/* GET home page. */
router.get('/', function(req, res) {

  
  if(req.query.oauth_token){
    //save the access token for the user
    
    
    dboxCli.accesstoken(req.session.request_token, function(status, access_token){
      console.log('access token is ' + access_token);
      req.session.access_token = access_token;
      global.dboxClient = dboxCli.client(access_token);
      
      return res.render('index', { title: 'Kloud Kitties Dropbox Demo -- Signed In',
        request_token: {
            oauth_token : ""
          }
      });
    });
    
    
  }
  else{
    dboxCli.requesttoken(function(status, request_token){
    console.log(request_token);
    req.session.request_token = request_token;
    return res.render('index', { title: 'Kloud Kitties Dropbox Demo',
      request_token: request_token });
  });
  }
  
  
});



module.exports = router;

var express = require('express');
var fs = require('fs');
var router = express.Router();

var domain_url ="http://getrusk.com:3000"

/* redis init */
var redis = require('redis');
var redis_client = redis.createClient();
redis_client.on('connect',function(err){
  if(err) throw err;
  console.log("redis connected.");
});

/* GET my storage page. */
router.get('/:storageId', function(req, res, next) {
  var storageId = encodeURIComponent(req.params.storageId);

  redis_client.hgetall('storages.list.'+storageId, function(err, list){
    res.render('storage', { 'id': storageId,
                            'domain_url':domain_url,
                            'list': list || {} });
  });
});

router.get('/:storageId/download/:name', function(req, res, next){

  var storageId = encodeURIComponent(req.params.storageId);
  var fileName = req.params.name;

  var options = {
    root:  __dirname + '/../public/uploads/',
    headers: {
        "Content-Description": "File Transfer",
        "Content-Disposition": "attachment; filename="+fileName,
        "Content-Transfer-Encoding": "binary"
    }
  };
  console.log(fileName);
  redis_client.hexists('storages.list.'+storageId, fileName, function(err, reply){
    if (err) {
      res.status(err.status).end();
    }
    if(reply == true){
      res.sendFile(fileName, options, function (err) {
        if (err) {
          res.status(400).end();
        }
      });
    } else {
      res.status(400).end();
    }
  });

});

router.delete('/:storageId/delete/:name', function(req, res, next){

  var storageId = encodeURIComponent(req.params.storageId);
  var fileName = req.params.name;
  var hash_key = 'storages.list.'+storageId;

  redis_client.hdel(hash_key, fileName,function(err, reply){
    if(err){
      res.json({
        "result" : "fail"
      });
    } else {
      fs.unlink(__dirname+"/../public/thumbnail/"+fileName, function(){
        fs.unlink(__dirname+"/../public/uploads/"+fileName, function(){
        });
      });
      res.json({
        "result" : "success"
      });
    }
  });
});

/* POST files in my storage. */
router.post('/:storageId/upload', function(req, res, next) {

  var storageId = encodeURIComponent(req.params.storageId);

  if(!req.files.file) {
    res.redirect('/'+storageId);
  }

  var hash_key = 'storages.list.'+storageId;
  var hash = {};
  var f;

  if(req.files.file instanceof Array) {

    for(var i=0;i<req.files.file.length;i++){
      var fileInfo = {}
      f = req.files.file[i];
      fileInfo.name = f.name;
      fileInfo.originalname = f.originalname;
      fileInfo.mimetype = f.mimetype;
      fileInfo.extension = f.extension;
      fileInfo.size = f.size;
      hash[f.name] = JSON.stringify(fileInfo);
    }

  } else if(req.files.file instanceof Object) {

    f = req.files.file;
    var fileInfo = {}
    fileInfo.name = f.name;
    fileInfo.originalname = f.originalname;
    fileInfo.mimetype = f.mimetype;
    fileInfo.extension = f.extension;
    fileInfo.size = f.size;
    hash[f.name] = JSON.stringify(fileInfo);
  }

  redis_client.hmset(hash_key, hash, function(err, reply){
    console.log(reply);
  });

  res.redirect('/'+storageId);

});

module.exports = router;
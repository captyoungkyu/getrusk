/* node js modules */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer')

/* route modules */
var storages = require('./routes/storage');
var easyimg = require('easyimage');

/* configuration load */
var configure = require('./config.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(configure.favicon));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/uploads/:id', function(req, res, next){
  res.status(400);
    res.render('error', {
        message: "FXXK YOU.",
        error: {}
    });
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ 
        dest: configure.upload_dest,
        rename: function (fieldname, filename) {
                  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); }) + "." + Date.now()
                },
        onParseStart: function () {
                  console.log('Form parsing started at: ', new Date())
                },
        onParseEnd: function (req, next) {
                  console.log('Form parsing completed at: ', new Date());
                  // call the next middleware 
                  next();
                },
        onFileUploadStart: function (file) {
                  if (file.mimetype.indexOf('image') == -1 || file.extension.toLowerCase().indexOf('js') != -1) return false;
                },
        onFileUploadData: function (file, data) {
                  console.log(data.length + ' of ' + file.fieldname + ' arrived')
                },
        onFileUploadComplete: function (file) {
                  easyimg.rescrop({
                       src: file.path, dst: configure.thumbnail_dest + file.name,
                       width:300, height:300
                    }).then(
                    function(image) {
                       console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
                    },
                    function (err) {
                      console.log(err);
                    }
                  );
                  console.log(file.fieldname + ' uploaded to  ' + file.path )
                  console.log("done! ---********************************")
                }
        })
);

app.use('/', storages);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

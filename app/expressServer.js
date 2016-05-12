var env = process.env.NODE_ENV || 'production',
express = require('express'),
swig = require('swig'),
bodyParser = require('body-parser'),
middlewares = require('./middlewares/admin'),
router = require('./website/router'),
multer  = require('multer');
var path = require('path');
/*var mkdirp = require('mkdirp');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var idTrabajo = req.body.idTrabajo;
    var idCotizacion = req.body.idCotizacion;
    if(idCotizacion == ''){
      mkdirp(__dirname + '/static/uploads/files/' + idTrabajo, function (err) {
           if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' 
                || file.mimetype == 'image/jpg' || file.mimetype == 'image/bmp' || file.mimetype == 'video/mp4'){
              mkdirp(__dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/multimedia', function (err) {
                cb(null, __dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/multimedia')
              });
           } else{
              mkdirp(__dirname + '/static/uploads/files/' + idTrabajo + '/documentos', function (err) {
                  cb(null, __dirname + '/static/uploads/files/' + idTrabajo + '/documentos')
              });
           }
    });
    }else{
      mkdirp(__dirname + '/static/uploads/files/' + idTrabajo, function (err) {
         mkdirp(__dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion, function (err) {
           if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' 
                || file.mimetype == 'image/jpg' || file.mimetype == 'image/bmp' || file.mimetype == 'video/mp4'){
              mkdirp(__dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/multimedia', function (err) {
                cb(null, __dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/multimedia')
              });
           } else{
              mkdirp(__dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/documentos', function (err) {
                  cb(null, __dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/documentos')
              });
           }
         });
    }); 
    }       
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage })*/

    //Alta de opciones
    var done=false;

    var ExpressServer = function(config){
      this.config = config || {};

      this.expressServer = express();

    // middlewares
    this.expressServer.use(bodyParser.urlencoded({extended: true}))
    this.expressServer.use(bodyParser.json());
    for (var middleware in middlewares){
      this.expressServer.use(middlewares[middleware]);
    }

    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    this.expressServer.set('views', __dirname + '/website/views/templates');
    swig.setDefaults({varControls:['[[',']]']});

    //////////////////////////////////////////////////////////////

    if(env == 'development'){
      console.log('OK NO HAY CACHE');
      this.expressServer.set('view cache', false);
      swig.setDefaults({cache: false, varControls:['[[',']]']});
    }

    for (var controller in router){
      var middles = new router[controller](this.config).middlewares || [];
      for (var funcionalidad in router[controller].prototype){
        var method = funcionalidad.split('_')[0];
        var entorno = funcionalidad.split('_')[1];
        var data = funcionalidad.split('_')[2];
        data = (method == 'get' && data !== undefined) ? ':data' : '';
        var url = '/api/' + controller + '/' + entorno + '/' + data;
        this.router(controller,funcionalidad,method,url,middles);
      }
    } 

    // //Configuracion de MULTER

    this.expressServer.get('/uploader',function(req,res){
     res.sendfile('app/static/uploader.htm');
    });

    this.expressServer.get('/success',function(req,res){
     res.sendfile('app/static/success.htm');
    });

    /*this.expressServer.post('/profile', upload.any(), function (req, res, next) {
      // req.file is the `avatar` file 
      // req.body will hold the text fields, if there were any 
      var x = req.files;
      res.writeHead(301,{Location: '/AngularJS/Templates/uploader.html?response=1'});
      res.end();
    })*/

    //Servimos el archivo angular
    this.expressServer.get('*', function(req, res){
      res.sendfile('app/static/index.html');
    });
  };

  ExpressServer.prototype.router = function(controller,funcionalidad,method,url,middles){
    console.log(url);
    var parameters = this.config.parameters;

    this.expressServer[method](url,middles,function(req,res,next){
     var conf = {
       'funcionalidad':funcionalidad,
       'req': req,
       'res': res,
       'next': next,
       'parameters' : parameters
     }

     var Controller = new router[controller](conf);
     Controller.response();
     
   });
  }
  module.exports = ExpressServer;
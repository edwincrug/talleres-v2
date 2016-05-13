var CotizacionView = require('../views/cotizacion'),
    CotizacionModel = require('../models/cotizacion');
var mkdirp = require('mkdirp');
multer = require('multer');
var idTipoArchivo;
var nameFile;

var Cotizacion = function (conf) {
    this.conf = conf || {};

    this.view = new CotizacionView();
    this.model = new CotizacionModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }

    this.middlewares = [
       upload.array('file[]', 20)
   ]
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dirname = 'C:/Desarrollo/talleres-v2/app';
        var idTrabajo = req.body.idTrabajo;
        var idCotizacion = req.body.idCotizacion;
        if (idCotizacion == '') {
            mkdirp(dirname + '/static/uploads/files/' + idTrabajo, function (err) {
                if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpg' || file.mimetype == 'image/bmp' || file.mimetype == 'video/mp4') {
                    mkdirp(dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/multimedia', function (err) {
                        cb(null, dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/multimedia')
                    });
                } else {
                    mkdirp(dirname + '/static/uploads/files/' + idTrabajo + '/documentos', function (err) {
                        cb(null, dirname + '/static/uploads/files/' + idTrabajo + '/documentos')
                    });
                }
            });
        } else {
            mkdirp(dirname + '/static/uploads/files/' + idTrabajo, function (err) {
                mkdirp(dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion, function (err) {
                    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpg' || file.mimetype == 'image/bmp' || file.mimetype == 'video/mp4') {
                        mkdirp(dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/multimedia', function (err) {
                            cb(null, dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/multimedia')
                        });
                    } else {
                        mkdirp(dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/documentos', function (err) {
                            cb(null, dirname + '/static/uploads/files/' + idTrabajo + '/' + idCotizacion + '/documentos')
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

var upload = multer({
    storage: storage
})

//Obtener el tipo de archivo
var obtenerTipoArchivo = function (ext) {
    if (ext == '.pdf' || ext == '.doc' || ext == '.xls' || ext == '.docx' || ext == '.xlsx' ||
        ext == '.PDF' || ext == '.DOC' || ext == '.XLS' || ext == '.DOCX' || ext == '.XLSX' || ext == '.ppt' || ext == '.PPT') {
        type = 1;
    } else if (ext == '.jpg' || ext == '.png' || ext == '.gif' || ext == '.bmp' || ext == '.JPG' || ext == '.PNG' || ext == '.GIF' || ext == '.BMP') {
        type = 2;
    } else if (ext == '.mp4') {
        type = 3;
    }
    return type;
}

//Se obtiene la extensión del archivo
var obtenerExtArchivo = function (file) {
    var file = file;
    var res = file.substring(file.length - 4, file.length)
    return res;
}

Cotizacion.prototype.get_see = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    //params = req.params.data;

    this.model.get(function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.see(res, object);
    });
}

//Método para la búsqueda de piezas nueva cotización
Cotizacion.prototype.post_buscarPieza = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var msgObj = {
        idTaller: req.body.idTaller,
        nombrePieza: req.body.nombrePieza
    }

    this.model.buscarPieza(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.buscarPieza(res, object);
    });
}

//Método para insertar nueva cotización Maestro
Cotizacion.prototype.post_cotizacionMaestro_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var msgObj = {
        idCita: req.body.idCita,
        idUsuario: req.body.idUsuario,
        observaciones: req.body.observaciones,
        idUnidad: req.body.idUnidad
    }

    this.model.cotizacionMaestro(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.cotizacionMaestro(res, object);
    });
}

//Método para insertar nueva cotización Detalle
Cotizacion.prototype.post_cotizacionDetalle = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var msgObj = {
        idCotizacion: req.body.idCotizacion,
        idTipoElemento: req.body.idTipoElemento,
        idElemento: req.body.idElemento,
        precio: req.body.precio,
        cantidad: req.body.cantidad
    }

    this.model.cotizacionDetalle(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.cotizacionDetalle(res, object);
    });
}

Cotizacion.prototype.get_buscar = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    //params = req.params.data;

    this.model.get(function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.see(res, object);
    });
}

Cotizacion.prototype.post_detail = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var objCotizacion = {
        idCotizacion: req.body.idCotizacion,
        idTaller: req.body.idTaller
    };

    this.model.detail(objCotizacion, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.detail(res, object);
    });
}

Cotizacion.prototype.get_chat_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    params = req.params.data;

    this.model.chat(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.chat(res, object);
    });
}

Cotizacion.prototype.post_message = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var msgObj = {
        idUsuario: req.body.idUsuario,
        mensaje: req.body.mensaje,
        idCita: req.body.idCita
    };

    //Asigno a params el valor de mis variables

    this.model.message(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.message(res, object);
    });
}

Cotizacion.prototype.get_ficha_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    params = req.params.data;

    this.model.ficha(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.ficha(res, object);
    });
}

Cotizacion.prototype.get_cotizacionByTrabajo_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    params = req.params.data;

    this.model.cotizacionByTrabajo(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.cotizacionByTrabajo(res, object);
    });
}

Cotizacion.prototype.post_cotizacionAprobacion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var aprobacionObj = {
        idCotizacion: req.body.cotizacion,
        idUsuario: req.body.usuario,
        comentarios: req.body.comentarios
    };

    //Asigno a params el valor de mis variables

    this.model.aprobacionCotizacion(aprobacionObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.aprobacionCotizacion(res, object);
    });
}

Cotizacion.prototype.get_evidenciasByCotizacion_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    params = req.params.data;

    this.model.evidenciasByCotizacion(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.evidenciasByCotizacion(res, object);
    });
}

//Método para insertar evidencia
Cotizacion.prototype.post_evidencia = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;
    //Arreglo evidencia
    var arrayEvidencia = [];

    for(var i=0; i < req.files.length;i++){
        var ext = obtenerExtArchivo(req.files[i].originalname);
        var idTipoArchivo = obtenerTipoArchivo(ext);
        
        arrayEvidencia.push({idTipoEvidencia: req.body.idTipoEvidencia,idTipoArchivo: idTipoArchivo,
                            idUsuario:req.body.idUsuario,idProcesoEvidencia:req.body.idCotizacion,
                            nombreArchivo:req.files[i].originalname}); 
    } 

    this.model.evidencia(arrayEvidencia, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.evidencia(res, object);
    });
}

Cotizacion.prototype.post_cotizacionRechazo = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var rechazoObj = {
        idCotizacion: req.body.cotizacion,
        idUsuario: req.body.usuario,
        comentarios: req.body.comentarios
    };

    //Asigno a params el valor de mis variables

    this.model.rechazoCotizacion(rechazoObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.rechazoCotizacion(res, object);
    });
}

//Método para insertar nueva cotización Detalle
Cotizacion.prototype.post_updateCotizacion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var msgObj = {
        idCotizacion: req.body.idCotizacion,
        idTipoElemento: req.body.idTipoElemento,
        idElemento: req.body.idElemento,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
        observaciones: req.body.observaciones,
        idEstatus: req.body.idEstatus
    }

    this.model.updateCotizacion(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.updateCotizacion(res, object);
    });
}

Cotizacion.prototype.get_docs_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this; //Asigno a params el valor de mis variables
    params = req.params.data;

    this.model.docs(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.docs(res, object);
    });
}

Cotizacion.prototype.get_servicioDetalle_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    params = req.params.data;

    this.model.servicioDetalle(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.servicioDetalle(res, object);
    });
}

//Proceso que envia correo de cotizaciones (nueva, aprobación, rechazo)
Cotizacion.prototype.post_mail = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var objMail = {
        idCotizacion: req.body.cotizacion,
        idTaller: req.body.taller,
        idOperacion: req.body.operacion,
        comentarios: req.body.comentario
    };

    //Asigno a params el valor de mis variables
    this.model.mail(objMail, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.mail(res, object);
    });
}

Cotizacion.prototype.get_datosCliente_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    params = req.params.data;

    this.model.datosCliente(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.datosCliente(res, object);
    });
}

module.exports = Cotizacion;
var CotizacionView = require('../views/ejemploVista'),
    CotizacionModel = require('../models/dataAccess2');
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
        var dirname = 'C:/Produccion/Talleres/talleres-v2/app';
        var idTrabajo = req.body.idTrabajo;
        var idCotizacion = req.body.idCotizacion;
        if (idCotizacion == '') {
            mkdirp(dirname + '/static/uploads/files/' + idTrabajo, function (err) {
                if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpg' || file.mimetype == 'image/bmp' || file.mimetype == 'video/mp4') {
                    mkdirp(dirname + '/static/uploads/files/' + idTrabajo + '/multimedia', function (err) {
                        cb(null, dirname + '/static/uploads/files/' + idTrabajo + '/multimedia')
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
        ext == '.PDF' || ext == '.DOC' || ext == '.XLS' || ext == '.DOCX' || ext == '.XLSX' || 
        ext == '.ppt' || ext == '.PPT' || ext == '.xml' || ext == '.XML') {
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

//Obtiene las cotizaciones pendientes por autorizar
Cotizacion.prototype.get_see = function (req, res, next) {
    var self = this;
    var params = [];
    
    this.model.query('SEL_COTIZACIONES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Método para la búsqueda de piezas para una cotización
Cotizacion.prototype.get_buscarPieza = function(req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis n variables
    
    var params = [{name: 'idTaller', value: req.query.idTaller, type: self.model.types.INT},
                  {name: 'nombrePieza', value: req.query.nombrePieza, type: self.model.types.STRING}];
    
    this.model.query('SEL_BUSQUEDA_PIEZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Método para insertar nueva cotización Maestro
Cotizacion.prototype.get_cotizacionMaestro = function (req, res, next) {
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
    

    this.model.post('INS_COTIZACION_MAESTRO_SP',params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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

    this.model.post('INS_COTIZACION_MAESTRO_SP',msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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

//Editar Cotización
Cotizacion.prototype.get_detail = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{name: 'idCotizacion', value: req.query.idCotizacion, 
                  type: self.model.types.DECIMAL},
                 {name: 'idTaller', value: req.query.idTaller, 
                  type: self.model.types.DECIMAL}];

    this.model.query('SEL_COTIZACION_DETALLE_SP',params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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
    var sIdProcesoEvidencia = "";
    for(var i=0; i < req.files.length;i++){
        var ext = obtenerExtArchivo(req.files[i].originalname);
        var idTipoArchivo = obtenerTipoArchivo(ext);
        
        if(req.body.vTrabajo === "1"){
            sIdProcesoEvidencia =  req.body.idTrabajo;
        }
        else{
            sIdProcesoEvidencia = req.body.idCotizacion;
        }
        arrayEvidencia.push({idTipoEvidencia: req.body.idTipoEvidencia,idTipoArchivo: idTipoArchivo,
                            idUsuario:req.body.idUsuario,idProcesoEvidencia:sIdProcesoEvidencia,
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
    var params = [{name: 'idCotizacion', value: req.query.idCotizacion, 
                  type: self.model.types.DECIMAL},
                 {name: 'idTipoElemento', value: req.query.idTipoElemento, 
                  type: self.model.types.DECIMAL},
                 {name: 'idElemento', value: req.query.idElemento, 
                  type: self.model.types.DECIMAL},
                 {name: 'precio', value: req.query.precio, 
                  type: self.model.types.DECIMAL},
                 {name: 'cantidad', value: req.query.cantidad, 
                  type: self.model.types.DECIMAL},
                 {name: 'observaciones', value: req.query.observaciones, 
                  type: self.model.types.STRING},
                 {name: 'idEstatus', value: req.query.idEstatus, 
                  type: self.model.types.DECIMAL}];

    this.model.post('UPD_COTIZACION_SP',params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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

//Se obtiene el detalle de la cotizacion desde la cita
Cotizacion.prototype.get_servicioDetalle = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;
    
    //Asigno a params el valor de mis variables
    var params = [{name: 'idCita', value: req.query.idCita, 
                  type: self.model.types.DECIMAL}];

    this.model.query('SEL_SERVICIO_DETALLE_SP',params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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
    
    //Asigno a params el valor de mis variables
    var params = [{name: 'idCotizacion', value: req.query.idCotizacion, 
                  type: self.model.types.DECIMAL},
                 {name: 'idTaller', value: req.query.idTaller, 
                  type: self.model.types.DECIMAL},
                 {name: 'idOperacion', value: req.query.idOperacion, 
                  type: self.model.types.DECIMAL},
                 {name: 'comentarios', value: req.query.comentarios, 
                  type: self.model.types.STRING}];

    this.model.post('SEL_NOTIFICACION_COTIZACION_SP',params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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

Cotizacion.prototype.get_evidenciasByOrden_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    params = req.params.data;

    this.model.evidenciasByOrden(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.evidenciasByOrden(res, object);
    });
}

Cotizacion.prototype.post_datosUnidad = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var obj = {
        idCotizacion: req.body.idCotizacion,
        idTrabajo: req.body.idTrabajo
    };

    this.model.datosUnidad(obj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.datosUnidad(res, object);
    });
}

module.exports = Cotizacion;
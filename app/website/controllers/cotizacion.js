var CotizacionView = require('../views/ejemploVista'),
    CotizacionModel = require('../models/dataAccess2');
var mkdirp = require('mkdirp');
multer = require('multer');
var idTipoArchivo;
var nameFile;
var fs = require('fs');

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
       function(req, res, next){
           req.consecutivo = obtieneConsecutivo('C:/Desarrollo/talleres-v2/app/static/uploads/files/48/documentos');
           next();
       }, upload.array('file[]', 20)
   ]
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //var dirname = 'C:/Produccion/Talleres/talleres-v2/app';
        var dirname = 'C:/Desarrollo/talleres-v2/app';
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
        //var dirname = 'C:/Produccion/Talleres/talleres-v2/app';
        var dirname = 'C:/Desarrollo/talleres-v2/app';
        var idTrabajo = req.body.idTrabajo;
        var idCotizacion = req.body.idCotizacion;
        var extensionFile = obtenerExtArchivo(file.originalname);
        var ruta = dirname + '/static/uploads/files/' + idTrabajo + '/documentos';

        if (req.body.idCategoria == '2') {
            if (req.body.idNombreEspecial == '1') {
                //var consecutivo = obtieneConsecutivo(ruta);
                cb(null, 'ComprobanteRecepcion' + req.consecutivo + extensionFile);
                //cb(null, file.originalname);
            }
            if (req.body.idNombreEspecial == '2') {
                cb(null, 'HojaCalidad' + extensionFile);
            }

        } else {
            cb(null, file.originalname);
        }
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

var obtieneConsecutivo = function (ruta) {
    var consecutivo = fs.readdirSync("" + ruta + "");
    return consecutivo.length + 1;
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
Cotizacion.prototype.get_buscarPieza = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis n variables

    var params = [{
            name: 'idTaller',
            value: req.query.idTaller,
            type: self.model.types.INT
        },
        {
            name: 'nombrePieza',
            value: req.query.nombrePieza,
            type: self.model.types.STRING
        }];

    this.model.query('SEL_BUSQUEDA_PIEZA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Método para insertar nueva cotización Maestro
Cotizacion.prototype.post_cotizacionMaestro = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{
            name: 'idCita',
            value: req.body.idCita,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.body.idUsuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'observaciones',
            value: req.body.observaciones,
            type: self.model.types.STRING
        },
        {
            name: 'idUnidad',
            value: req.body.idUsuario,
            type: self.model.types.DECIMAL
        }];


    this.model.post('INS_COTIZACION_MAESTRO_SP', params, function (error, result) {
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
    var params = [{
            name: 'idCotizacion',
            value: req.body.idCotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTipoElemento',
            value: req.body.idTipoElemento,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idElemento',
            value: req.body.idElemento,
            type: self.model.types.STRING
        },
        {
            name: 'precio',
            value: req.body.precio,
            type: self.model.types.DECIMAL
        },
        {
            name: 'cantidad',
            value: req.body.cantidad,
            type: self.model.types.DECIMAL
        }];

    this.model.post('INS_COTIZACION_DETALLE_SP', params, function (error, result) {
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

//Detalle Cotizacion - Editar Cotización
Cotizacion.prototype.get_detail = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTaller',
            value: req.query.idTaller,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_COTIZACION_DETALLE_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene la conversación del chat de una cita
Cotizacion.prototype.get_chat = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_CHAT_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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

//Obtiene la ficha técnica de la unidad
Cotizacion.prototype.get_ficha = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_FICHA_TECNICA_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene todas las cotizaciones de un trabajo
Cotizacion.prototype.get_cotizacionByTrabajo = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_COTIZACIONES_BY_TRABAJO_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Autoriza una cotización
Cotizacion.prototype.post_cotizacionAprobacion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.body.cotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.body.usuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'comentarios',
            value: req.body.comentarios,
            type: self.model.types.STRING
        }
    ];

    this.model.post('INS_AUTORIZACION_COTIZACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene las evidencias de una cotización
Cotizacion.prototype.get_evidenciasByCotizacion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_EVIDENCIAS_BY_COTIZACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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
    for (var i = 0; i < req.files.length; i++) {
        var ext = obtenerExtArchivo(req.files[i].originalname);
        var idTipoArchivo = obtenerTipoArchivo(ext);

        if (req.body.vTrabajo === "1") {
            sIdProcesoEvidencia = req.body.idTrabajo;
        } else {
            sIdProcesoEvidencia = req.body.idCotizacion;
        }
        arrayEvidencia.push({
            idTipoEvidencia: req.body.idTipoEvidencia,
            idTipoArchivo: idTipoArchivo,
            idUsuario: req.body.idUsuario,
            idProcesoEvidencia: sIdProcesoEvidencia,
            idCategoria: req.body.idCategoria,
            nombreArchivo: req.files[i].originalname
        });
    }

    this.model.evidencia(arrayEvidencia, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Rechaza una cotización
Cotizacion.prototype.post_cotizacionRechazo = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.body.cotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.body.usuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'comentarios',
            value: req.body.comentarios,
            type: self.model.types.STRING
        }
    ];

    this.model.post('INS_RECHAZO_COTIZACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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
    var params = [{
            name: 'idCotizacion',
            value: req.body.idCotizacion,
            type: self.model.types.DECIMAL
                        },
        {
            name: 'idTipoElemento',
            value: req.body.idTipoElemento,
            type: self.model.types.DECIMAL
                        },
        {
            name: 'idElemento',
            value: req.body.idElemento,
            type: self.model.types.DECIMAL
                        },
        {
            name: 'precio',
            value: req.body.precio,
            type: self.model.types.DECIMAL
                        },
        {
            name: 'cantidad',
            value: req.body.cantidad,
            type: self.model.types.DECIMAL
                        },
        {
            name: 'observaciones',
            value: req.body.observaciones,
            type: self.model.types.STRING
                        },
        {
            name: 'idEstatus',
            value: req.body.idEstatus,
            type: self.model.types.DECIMAL
                        }];

    this.model.post('UPD_COTIZACION_SP', params, function (error, result) {
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
    var params = [{
        name: 'idCita',
        value: req.query.idCita,
        type: self.model.types.DECIMAL
    }];

    this.model.query('SEL_SERVICIO_DETALLE_SP', params, function (error, result) {
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
    var params = [{
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTaller',
            value: req.query.idTaller,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idOperacion',
            value: req.query.idOperacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'comentarios',
            value: req.query.comentarios,
            type: self.model.types.STRING
        }];

    this.model.post('SEL_NOTIFICACION_COTIZACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene los datos del cliente
Cotizacion.prototype.get_datosCliente = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_DATOS_CLIENTE_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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

Cotizacion.prototype.get_datosUnidad = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.DECIMAL
                        },
        {
            name: 'idTrabajo',
            value: req.query.idTrabajo,
            type: self.model.types.DECIMAL
                        }];

    this.model.query('SEL_DATOS_UNIDAD_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

module.exports = Cotizacion;
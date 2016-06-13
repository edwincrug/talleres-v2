var CotizacionView = require('../views/ejemploVista'),
    CotizacionModel = require('../models/dataAccess2');
var mkdirp = require('mkdirp');
multer = require('multer');
var idTipoArchivo;
var nameFile;
var fs = require('fs');
var totalFiles = 0;

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
       /*function(req, res, next){
           req.consecutivo = obtieneConsecutivo('C:/Desarrollo/talleres-v2/app/static/uploads/files/48/documentos');
           next();
       }, upload.array('file[]', 20)*/
   ]
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //var dirname = 'C:/Produccion/Talleres/talleres-v2/app';
        var dirname = 'C:/Desarrollo/talleres-v2/app/static/uploads/files/';
        var idTrabajo = req.body.idTrabajo;
        var idCotizacion = req.body.idCotizacion;
        
        if (idCotizacion == '') {
            if (!fs.existsSync(dirname + idTrabajo)){
                fs.mkdirSync(dirname + idTrabajo);
                fs.mkdirSync(dirname + idTrabajo + '/multimedia');
                fs.mkdirSync(dirname + idTrabajo + '/documentos');
            } 
            
            if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpg' || file.mimetype == 'image/bmp' || file.mimetype == 'video/mp4') {
                   cb(null, dirname + idTrabajo + '/multimedia')              
            } else{
                cb(null, dirname + idTrabajo + '/documentos')
            }
        } else{
            if (!fs.existsSync(dirname + idTrabajo)){
                fs.mkdirSync(dirname + idTrabajo);
            } 
            if (!fs.existsSync(dirname + idTrabajo + '/' + idCotizacion)){
                fs.mkdirSync(dirname + idTrabajo + '/' + idCotizacion);
                fs.mkdirSync(dirname + idTrabajo + '/' + idCotizacion + '/multimedia');
                fs.mkdirSync(dirname + idTrabajo + '/' + idCotizacion + '/documentos');
            } 
                
            if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpg' || file.mimetype == 'image/bmp' || file.mimetype == 'video/mp4') {
                   cb(null, dirname + idTrabajo + '/' + idCotizacion + '/multimedia')              
            } else{
                cb(null, dirname + idTrabajo + '/' + idCotizacion + '/documentos')
            }
        }
    },
    filename: function (req, file, cb) {
        //var dirname = 'C:/Produccion/Talleres/talleres-v2/app';
        /*var dirname = 'C:/Desarrollo/talleres-v2/app';
        var idTrabajo = req.body.idTrabajo;
        var idCotizacion = req.body.idCotizacion;
        var extensionFile = obtenerExtArchivo(file.originalname);
        var ruta = dirname + '/static/uploads/files/' + idTrabajo + '/documentos';*/

        cb(null, file.originalname);
        /*if (req.body.idCategoria == '2') {
            if (req.body.idNombreEspecial == '1') {
                //var consecutivo = obtieneConsecutivo(ruta);
                cb(null, 'ComprobanteRecepcion' + req.consecutivo + extensionFile);
                //cb(null, file.originalname);
            }
            if (req.body.idNombreEspecial == '2') {
                cb(null, 'HojaCalidad' + extensionFile);
            }
        /* var consecutivo = obtieneConsecutivo(ruta);
         cb(null, 'ComprobanteRecepcion' + consecutivo + extensionFile);*/
        //if (req.body.idCategoria == '2') {

        //if (req.body.idNombreEspecial == '1') {
        /* var consecutivo = obtieneConsecutivo('C:/Desarrollo/talleres-v2/app/static/uploads/files/44/documentos');
            cb(null, 'ComprobanteRecepcion' + consecutivo + extensionFile);
            cb(null, file.originalname);
        //}
        /*if (req.body.idNombreEspecial == '2') {
            cb(null, 'HojaCalidad' + extensionFile);
        }*/

        /*} else {
            cb(null, file.originalname);
        }*/
    }
});

var upload = multer({
    storage: storage//console.log("File name : "+ file.name +"\n"+ "FilePath: "+ file.path)
});

//Método para la validación de terminación de subida de archivos
/*Cotizacion.prototype.post_uploadfiles = function(req,res){
	//upload(req,res,function(err) {
		console.log(req.body);
		console.log(req.files);
		//if(err) {console.log(res.finished);
			//return res.end("Error uploading file.");
		//}
		res.end("File is uploaded");
        console.log(res.finished);
	//});
};*/

//Método para insertar evidencia
/*Cotizacion.prototype.post_uploadfiles = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;
    
    res.end("File is uploaded");
//    if (req.body.vTrabajo === "1") {
//        sIdProcesoEvidencia = req.body.idTrabajo;
//    } else {
//        sIdProcesoEvidencia = req.body.idCotizacion;
//    }
    var params = [];
    
    var arrayEvidencia = [];
    for (var i = 0; i < req.files.length; i++) {
        arrayEvidencia.push({
            idTipoEvidencia: req.body.idTipoEvidencia,
            idTipoArchivo: 2,
            idUsuario: req.body.idUsuario,
            idProcesoEvidencia: 63,
            idCategoria: req.body.idCategoria,
            nombreArchivo: req.files[i].filename,
            idNombreEspecial: req.body.idNombreEspecial
        });
    }
    
    this.model.evidencia(arrayEvidencia, function (error, result) {
    //Callback
        object.error = error;
        object.result = result;

        //self.view.expositor(res, object);
    });
}*/

//Obtener el tipo de archivo
var obtenerTipoArchivo = function (ext) {
    var type;
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
    return '.'+file.split('.').pop();
}

var obtieneConsecutivo = function (ruta) {
    var consecutivo = fs.readdirSync(ruta);
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

    var params = [{
            name: 'idUsuario',
            value: req.body.idUsuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'mensaje',
            value: req.body.mensaje,
            type: self.model.types.STRING
        },
        {
            name: 'idCita',
            value: req.body.idCita,
            type: self.model.types.DECIMAL
        }];

    this.model.post('INS_MENSAJE_CHAT_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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

////Método para insertar evidencia
Cotizacion.prototype.post_uploadfiles = function (req, res, next) {
    res.end("File is uploaded");
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;
    //Arreglo evidencia
    var arrayEvidencia = [];
    //var sIdProcesoEvidencia = "";
    //si la categoría de los documentos es 2 = (documentos especiales)
    //si la categoría de los documentos es 1 = (documentos normales)
    if (req.body.idCategoria === "1") {
        for (var i = 0; i < req.files.length; i++) {
            var ext = obtenerExtArchivo(req.files[i].originalname);
            var idTipoArchivo = obtenerTipoArchivo(ext);
            arrayEvidencia.push({
                idTipoEvidencia: req.body.idTipoEvidencia,
                idTipoArchivo: idTipoArchivo,
                idUsuario: req.body.idUsuario,
                idProcesoEvidencia: req.body.idCotizacion,
                idCategoria: req.body.idCategoria,
                nombreArchivo: req.files[i].originalname,
                idNombreEspecial: req.body.idNombreEspecial
            });
        }
    } else
    if (req.body.idCategoria === "2") {
        var countDocs = 0;
        var countImgs = 0;
        var nuevoNombre = '';
        var consecutivoDocs = 0;
        var consecutivoImgs = 0;
        
        //obtiene el número total por tipo de archivo
        for (var i = 0; i < req.files.length; i++) {
            var ext = obtenerExtArchivo(req.files[i].originalname);
            var idTipoArchivo = obtenerTipoArchivo(ext);
            if (idTipoArchivo == 1) {
                countDocs++;
            } else
            if (idTipoArchivo == 2) {
                countImgs++;
            }
        }
        
        //obtiene el número de documentos para renombrar
        if ((countFilesDirectory('C:/Desarrollo/talleres-v2/app/static/uploads/files/' + req.body.idTrabajo + '/documentos/') - countDocs) === 0) {
            consecutivoDocs = 1;
            console.log(consecutivoDocs);
        } else {
            consecutivoDocs = (countFilesDirectory('C:/Desarrollo/talleres-v2/app/static/uploads/files/' + req.body.idTrabajo + '/documentos/') + 1) - countDocs;
            console.log(consecutivoDocs);
        }
        
        //obtiene el número de imágenes para renombrar
        if ((countFilesDirectory('C:/Desarrollo/talleres-v2/app/static/uploads/files/' + req.body.idTrabajo + '/multimedia/') - countImgs) === 0) {
            consecutivoImgs = 1;
            console.log(consecutivoImgs);
        } else {
            consecutivoImgs = (countFilesDirectory('C:/Desarrollo/talleres-v2/app/static/uploads/files/' + req.body.idTrabajo + '/multimedia/') + 1) - countImgs;
            console.log(consecutivoImgs);
        }

        for (var i = 0; i < req.files.length; i++) {

            var ext = obtenerExtArchivo(req.files[i].originalname);
            var idTipoArchivo = obtenerTipoArchivo(ext);

            if (req.body.idNombreEspecial == 1) nuevoNombre = 'ComprobanteRecepcion';
            if (req.body.idNombreEspecial == 2) nuevoNombre = 'HojaCalidad';
            if (req.body.idNombreEspecial == 3) nuevoNombre = 'Factura';
            if (req.body.idNombreEspecial == 4) {
                if (ext == '.xml') {
                    nuevoNombre = 'COPADE';
                } else {
                    nuevoNombre = 'Adenda';
                }
            }
            
            //tipo archivo documento
            if (idTipoArchivo == 1) {
                fs.rename('C:/Desarrollo/talleres-v2/app/static/uploads/files/' + req.body.idTrabajo + '/documentos/' + req.files[i].originalname, 'C:/Desarrollo/talleres-v2/app/static/uploads/files/' + req.body.idTrabajo + '/documentos/' + nuevoNombre + consecutivoDocs + obtenerExtArchivo(req.files[i].originalname), function (err) {
                    if (err) console.log('ERROR: ' + err);
                });

                arrayEvidencia.push({
                    idTipoEvidencia: req.body.idTipoEvidencia,
                    idTipoArchivo: idTipoArchivo,
                    idUsuario: req.body.idUsuario,
                    idProcesoEvidencia: req.body.idTrabajo,
                    idCategoria: req.body.idCategoria,
                    nombreArchivo: nuevoNombre + consecutivoDocs + obtenerExtArchivo(req.files[i].originalname),
                    idNombreEspecial: req.body.idNombreEspecial
                });
                consecutivoDocs++;
            } else //tipo archivo imagen
            if (idTipoArchivo == 2) {
                fs.rename('C:/Desarrollo/talleres-v2/app/static/uploads/files/' + req.body.idTrabajo + '/multimedia/' + req.files[i].originalname, 'C:/Desarrollo/talleres-v2/app/static/uploads/files/' + req.body.idTrabajo + '/multimedia/' + nuevoNombre + consecutivoImgs + obtenerExtArchivo(req.files[i].originalname), function (err) {
                    if (err) console.log('ERROR: ' + err);
                });

                arrayEvidencia.push({
                    idTipoEvidencia: req.body.idTipoEvidencia,
                    idTipoArchivo: idTipoArchivo,
                    idUsuario: req.body.idUsuario,
                    idProcesoEvidencia: req.body.idTrabajo,
                    idCategoria: req.body.idCategoria,
                    nombreArchivo: nuevoNombre + consecutivoImgs + obtenerExtArchivo(req.files[i].originalname),
                    idNombreEspecial: req.body.idNombreEspecial
                });
                consecutivoImgs++;
            }
        }
    }
    this.model.evidencia(arrayEvidencia, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

var countFilesDirectory = function (dir) {
    var files = fs.readdirSync(dir);
    console.log(files.length);
    return files.length;
};

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
        },
        {
            name: 'idTipo',
            value: req.body.idTipo,
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

Cotizacion.prototype.get_evidenciasByOrden = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idTrabajo',
            value: req.query.idTrabajo,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_EVIDENCIAS_BY_TRABAJO_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
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
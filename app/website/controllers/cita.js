var CitaView = require('../views/ejemploVista'),
    CitaModel = require('../models/dataAccess2'),
	moment = require('moment');

//configuración para el objeto cita
var Cita = function(conf){
	this.conf = conf || {};

	this.view = new CitaView();
	this.model = new CitaModel({ parameters : this.conf.parameters});

	this.response = function(){
		this[this.conf.funcionalidad](this.conf.req,this.conf.res,this.conf.next);
	}
}

//obtiene el trabajo de la cita
Cita.prototype.get_unidad = function(req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idCliente', value: req.query.idCliente, type: self.model.types.INT},
                  {name: 'datoUnidad', value: req.query.datoUnidad, type: self.model.types.STRING}];

    this.model.query('SEL_UNIDAD_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene el trabajo de la cita
Cita.prototype.get_cliente = function(req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;
    
    //asignación de valores mediante parámetros del request
    var params = [{name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT}];

    this.model.query('SEL_CLIENTE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene las citas de la unidad
Cita.prototype.get_cita = function(req, res, next){
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idUnidad', value: req.query.idUnidad, type: self.model.types.INT},
                  {name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT}];
    
    this.model.query('SEL_UNIDAD_CITA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene los talleres
Cita.prototype.get_taller = function(req, res, next){
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'datoTaller', value: req.query.datoTaller, type: self.model.types.STRING}];
	
    this.model.query('SEL_TALLER_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//devuelve los paquetes/piezas del taller seleccionado
Cita.prototype.get_paquete = function(req, res, next){
	//Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idTrabajo', value: req.query.idTrabajo, type: self.model.types.INT}];
	
    this.model.query('SEL_PAQUETE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene el trabajo de la cita
Cita.prototype.get_trabajo = function(req, res, next){
	//Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idCita', value: req.query.idCita, type: self.model.types.INT}];

    this.model.query('SEL_UNIDAD_TRABAJO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

Cita.prototype.get_buscaCita = function(req,res,next){
	//Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis variables    
    var params = [{name: 'fecha', value: req.query.fecha, type:                             self.model.types.STRING},
                  {name: 'idCita', value: req.query.idCita, type: self.model.types.DECIMAL},
                 {name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.DECIMAL}];

    this.model.query('SEL_CITA_TALLER_SP',params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//insertar nueva cita para una unidad
Cita.prototype.post_addcita = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis variables
    var params = [{name: 'idUnidad', value: req.body.idUnidad, type:self.model.types.INT},
                  {name: 'idTaller', value: req.body.idTaller, type: self.model.types.INT},
                  {name: 'fecha', value: req.body.fecha, type: self.model.types.STRING},
                  {name: 'trabajo', value: req.body.trabajo, type: self.model.types.STRING},
                  {name: 'observacion', value: req.body.observacion, type: self.model.types.STRING},
                  {name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT},
                  {name: 'idTipoCita', value: req.body.idTipoCita, type: self.model.types.INT}];

    this.model.post('INS_CITA_SP', params, function (error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//insertar cita servicio detalle
Cita.prototype.post_addcitaserviciodetalle = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis variables
    var params = [{name: 'idCita', value: req.body.idCita, type:self.model.types.INT},
                  {name: 'idTipoElemento', value: req.body.idTipoElemento, type: self.model.types.INT},
                  {name: 'idElemento', value: req.body.idElemento, type: self.model.types.INT},
                  {name: 'cantidad', value: req.body.cantidad, type: self.model.types.INT}];

    this.model.post('INS_CITA_SERVICIO_DETALLE_SP', params, function (error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//realiza el envío de email para la confimación de la cita
Cita.prototype.get_enviaremailcita = function(req, res, next){
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idCita', value: req.query.idCita, type: self.model.types.INT}];
	
    this.model.query('SEL_NOTIFICACION_CITA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//valida si la cita ya está confirmada o de lo contrario lo confirma
Cita.prototype.get_validaconfirmacioncita = function(req, res, next){
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
	//Referencia a la clase para callback
	var self = this;
	//Asigno a params el valor de mis variables
	var params = [{name: 'idCita', value: req.query.idCita, type:self.model.types.INT}];
	
    this.model.query('SEL_VALIDA_CONIFIRMACION_CITA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

module.exports = Cita;
var TrabajoView = require('../views/ejemploVista'),
	TrabajoModel = require('../models/dataAccess2'),
	moment = require('moment');

var Trabajo = function(conf){
	this.conf = conf || {};

	this.view = new TrabajoView();
	this.model = new TrabajoModel({ parameters : this.conf.parameters});

	this.response = function(){
		this[this.conf.funcionalidad](this.conf.req,this.conf.res,this.conf.next);
	}
}

//devuelve los trabajos con estatus iniciados
Trabajo.prototype.get_trabajo = function(req, res, next){
	//Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT}];
	
    this.model.query('SEL_TRABAJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene los trabajos con estatus de terminado
Trabajo.prototype.get_trabajoterminado = function(req, res, next){
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT}];
	
    this.model.query('SEL_TRABAJO_TERMINADO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//realiza la actualización del trabajo a terminado
Trabajo.prototype.post_updtrabajoterminado = function(req, res, next){
	//Referencia a la clase para callback
	var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idTrabajo', value: req.body.idTrabajo, type: self.model.types.INT},
                  {name: 'observacion', value: req.body.observacion, type: self.model.types.STRING}];
	
	this.model.post('UPD_TERMINA_TRABAJO_SP', params, function (error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//realiza la actualización del trabajo a hojaCalidad
Trabajo.prototype.post_updtrabajohojacalidad = function(req, res, next){
	//Referencia a la clase para callback
	var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idTrabajo', value: req.body.idTrabajo, type: self.model.types.INT}];
	
	this.model.post('UPD_TRABAJO_HOJACALIDAD_SP', params, function (error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//realiza la actualización del trabajo a cerrado
Trabajo.prototype.post_updtrabajocerrado = function(req, res, next){
	//Referencia a la clase para callback
	var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idTrabajo', value: req.body.idTrabajo, type: self.model.types.INT}];
	
	this.model.post('UPD_TRABAJO_APROBADO_SP', params, function (error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//realiza la actualización del trabajo a facturado
Trabajo.prototype.post_updtrabajofacturado = function(req, res, next){
	//Referencia a la clase para callback
	var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idTrabajo', value: req.body.idTrabajo, type: self.model.types.INT}];
	
	this.model.post('UPD_TRABAJO_FACTURADO_SP', params, function (error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//TimeLine
Trabajo.prototype.get_timeLine = function(req, res, next){
	//Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{name: 'idCita', value: req.query.idCita, type: self.model.types.INT}];

    this.model.query('SEL_TIMELINE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//inserta el trabajo de la cita
Trabajo.prototype.post_insertTrabajo = function(req, res, next){
    //Objeto que almacena la respuesta
	var object = {};
	//Referencia a la clase para callback
	var self = this;
    //Objeto que envía los parámetros
    var params = {};
    
    //Asigno a params el valor de mis variables
    var params = [{name: 'idCita', value: req.body.idCita, 
                  type: self.model.types.DECIMAL},
                 {name: 'idUsuario', value: req.body.idUsuario, 
                  type: self.model.types.DECIMAL},
                 {name: 'idUnidad', value: req.body.idUnidad, 
                  type: self.model.types.DECIMAL}];
	
	this.model.post('INS_TRABAJO_SP',params, function (error, result) {
    //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}    

module.exports = Trabajo;
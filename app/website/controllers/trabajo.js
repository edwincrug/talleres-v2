var TrabajoView = require('../views/trabajo'),
	TrabajoModel = require('../models/dataAccess'),
	moment = require('moment');

var Trabajo = function(conf){
	this.conf = conf || {};

	this.view = new TrabajoView();
	this.model = new TrabajoModel({ parameters : this.conf.parameters});

	this.response = function(){
		this[this.conf.funcionalidad](this.conf.req,this.conf.res,this.conf.next);
	}
}

Trabajo.prototype.post_save = function(req,res,next){

}

//obtiene los trabajos con estatus de terminado
Trabajo.prototype.get_trabajoterminado = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = null;
	//Referencia a la clase para callback
	var self = this;
	
	this.model.get('SEL_TRABAJO_TERMINADO_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

//realiza la actualización del trabajo a terminado
Trabajo.prototype.post_updtrabajoterminado = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	var msgObj = {
        idTrabajo: req.body.idTrabajo,
        observacion: req.body.observacion
    }
	
	this.model.updterminaTrabajo(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.post(res, object);
    });
}

//obtiene los trabajos con estatus diferente a terminado
Trabajo.prototype.get_trabajo = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = null;
	//Referencia a la clase para callback
	var self = this;
	
	this.model.get( 'SEL_TRABAJO_SP', params,function(error,result){
		//callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

//realiza la actualización del trabajo a cerrado
Trabajo.prototype.post_updtrabajocerrado = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Referencia a la clase para callback
	var self = this;

	var msgObj = {
        idTrabajo: req.body.idTrabajo,
    }
	
	this.model.updCierraTrabajo(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.post(res, object);
    });
}

//realiza la actualización del trabajo a cerrado
Trabajo.prototype.post_updtrabajofacturado = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Referencia a la clase para callback
	var self = this;

	var msgObj = {
        idTrabajo: req.body.idTrabajo,
    }
	
	this.model.updFacturaTrabajo(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.post(res, object);
    });
}

//TimeLine
Trabajo.prototype.get_timeLine_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Referencia a la clase para callback
	var self = this;
	//Objeto que envía los parámetros
	var params = {}; 

	//Asigno a params el valor de mis variables
	params.name = 'idCita';
	params.value = req.params.data;
	params.type = 1;
	
	this.model.get('SEL_TIMELINE_SP',params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.see(res, object);
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
    var msgObj = {
        idCita: req.body.idCita,
        idUsuario: req.body.idUsuario,
        idUnidad: req.body.idUnidad
    }
	
	this.model.insertTrabajo(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.post(res, object);
    });
}
module.exports = Trabajo;
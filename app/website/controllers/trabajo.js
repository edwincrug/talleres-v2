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

//obtiene el trabajo de la cita
Trabajo.prototype.get_unidadtrabajo_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	//Asigno a params el valor de mis variables
	params.name = 'idUnidad';
	params.value = req.params.data;
	params.type = 1;
	
	this.model.get( 'SEL_TRABAJO_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

module.exports = Trabajo;
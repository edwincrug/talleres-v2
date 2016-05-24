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
    var params = [];

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
    var params = [{name: 'idUnidad', value: req.query.idUnidad, type: self.model.types.INT}];
    
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

Cita.prototype.post_buscaCita = function(req,res,next){
	//Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis variables
    var msgObj = {
        fecha: req.body.fecha,
        idCita: req.body.idCita
    }

    this.model.postBuscaCita(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.post(res, object);
    });
}

//obtiene las cotizaciones por unidad
Cita.prototype.get_cotizacion_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	//Asigno a params el valor de mis variables
	params.name = 'idTrabajo';
	params.value = req.params.data;
	params.type = 1;
	
	this.model.get( 'SEL_UNIDAD_COTIZACION_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

//devuelve los detalles de las cotizaciones
Cita.prototype.get_cotizaciondetalle_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	//Asigno a params el valor de mis variables
	params.name = 'idTrabajo';
	params.value = req.params.data;
	params.type = 1;
	
	this.model.get( 'SEL_UNIDAD_COTDETALLE_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

//insertar nueva cita para una unidad
Cita.prototype.post_addcita = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis variables
    var msgObj = {
        idUnidad: req.body.idUnidad,
        idTaller: req.body.idTaller,
        fecha: req.body.fecha,
        trabajo: req.body.trabajo,
        observacion: req.body.observacion,
        idUsuario: req.body.idUsuario
    }

    this.model.post(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.post(res, object);
    });
}

//inserta cita servicio detalles
Cita.prototype.post_addCitaServicioDetalle = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var msgObj = {
        idCita: req.body.idCita,
        idTipoElemento: req.body.idTipoElemento,
        idElemento: req.body.idElemento,
        cantidad: req.body.cantidad
    }

    this.model.postCitaServicioDetalle(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.post(res, object);
    });
}

//obtiene el historial de cita
Cita.prototype.get_historialcita_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	//Asigno a params el valor de mis variables
	params.name = 'idCita';
	params.value = req.params.data;
	params.type = 1;
	
	this.model.get( 'SEL_HISTORIAL_CITA_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

//obtiene el historial de trabajo
Cita.prototype.get_historialtrabajo_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	//Asigno a params el valor de mis variables
	params.name = 'idTrabajo';
	params.value = req.params.data;
	params.type = 1;
	
	this.model.get( 'SEL_HISTORIAL_TRABAJO_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

//obtiene el historial de cotizaciones
Cita.prototype.get_historialcotizacion_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	//Asigno a params el valor de mis variables
	params.name = 'idTrabajo';
	params.value = req.params.data;
	params.type = 1;
	
	this.model.get( 'SEL_HISTORIAL_COTIZACION_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

//devuelve la cita confirmada
Cita.prototype.post_citaconfirmada = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	var msgObj = {
        idCita: req.body.idCita
    }
	
	this.model.postConfirmarCita(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.post(res, object);
    });
}

//realiza el envío de email para la confimación de la cita
Cita.prototype.get_enviaremailcita_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	var msgObj = {
        idCita: req.body.idCita
    }
	
	this.model.postEnviaremailcita(msgObj, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.post(res, object);
    });
}

//obtiene el trabajo de la cita
Cita.prototype.get_enviaremailcita_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	//Asigno a params el valor de mis variables
	params.name = 'idCita';
	params.value = req.params.data;
	params.type = 1;
	
	this.model.get( 'SEL_NOTIFICACION_CITA_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

//obtiene el trabajo de la cita
Cita.prototype.get_validaconfirmacioncita_data = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	//Asigno a params el valor de mis variables
	params.name = 'idCita';
	params.value = req.params.data;
	params.type = 1;
	
	this.model.get('SEL_VALIDA_CONIFIRMACION_CITA_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

module.exports = Cita;
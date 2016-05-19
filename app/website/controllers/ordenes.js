var OrdenView = require('../views/ordenes'),
	OrdenModel = require('../models/ordenes');

var Orden = function(conf){
	this.conf = conf || {};

	this.view = new OrdenView();
	this.model = new OrdenModel({ parameters : this.conf.parameters});

	this.response = function(){
		this[this.conf.funcionalidad](this.conf.req,this.conf.res,this.conf.next);
	}
}

//Obtiene las ordenes pendientes por cobrar
Orden.prototype.get_ordenesporcobrar = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    this.model.ordenesporcobrar(function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.ordenesporcobrar(res, object);
    });
}

//Actualiza el estatus de una órden - cobrada
Orden.prototype.post_trabajocobrado = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var objTrabajoCobrado = {
        idTrabajo: req.body.idTrabajo
    };

    this.model.trabajocobrado(objTrabajoCobrado, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.trabajocobrado(res, object);
    });
}

module.exports = Orden;
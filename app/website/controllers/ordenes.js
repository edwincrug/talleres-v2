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

module.exports = Orden;
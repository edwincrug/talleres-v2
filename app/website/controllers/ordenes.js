var OrdenView = require('../views/ejemploVista'),
    OrdenModel = require('../models/dataAccess2');

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
    var self = this;
    var params = [];
    
    this.model.query('SEL_ORDENES_POR_COBRAR_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
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

    var params = [{
            name: 'idTrabajo',
            value: req.body.idTrabajo,
            type: self.model.types.INT
        }];

    this.model.post('INS_TRABAJO_CONCLUIDO_SP',params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

module.exports = Orden;
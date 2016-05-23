var ViewPrinter = require('../views/ejemploVista'),
    DataAccess2 = require('../models/dataAccess2');

var Example = function(conf) {
    this.conf = conf || {};
    this.view = new ViewPrinter();
    this.model = new DataAccess2({
        parameters: this.conf.parameters
    });
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

//obtiene el trabajo de la cita
Example.prototype.get_gejemplo = function(req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    var params = [];
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis n variables

    /*if (req.params.data) {
        params.push({
            name: 'idCita',
            value: req.params.data,
            type: self.model.types.INT
        })
    }*/
    
    /* Agregar otro input
    if (req.params.data) {
        params.push({
            name: 'idCita',
            value: req.params.data,
            type: self.model.types.INT
        })
    }
    */

    this.model.query('SEL_BUSQUEDA_PIEZA_PRUEBA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene el trabajo de la cita
Example.prototype.get_gpieza = function(req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis n variables
    
    var params = [{name: 'idTaller', value: req.query.idTaller, type: self.model.types.INT},
                  {name: 'nombrePieza', value: req.query.nombrePieza, type: self.model.types.STRING}];
    /*if (req.params.data) {
        params.push({
            name: 'idCita',
            value: req.params.data,
            type: self.model.types.INT
        })
    }*/
    
    /* Agregar otro input
    if (req.params.data) {
        params.push({
            name: 'idCita',
            value: req.params.data,
            type: self.model.types.INT
        })
    }
    */

    this.model.query('SEL_BUSQUEDA_PIEZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Método para la búsqueda de piezas nueva cotización
/*Example.prototype.post_buscarPieza = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = [];
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{name: 'idTaller', value: req.body.idTaller, type: self.model.types.INT},
                  {name: 'nombrePieza', value: req.body.nombrePieza, type: self.model.types.STRING}];
    this.model.post(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}*/

module.exports = Example;
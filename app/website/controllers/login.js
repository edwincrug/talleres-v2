var LoginView = require('../views/login'),
	LoginModel = require('../models/login');

var Login = function(conf){
	this.conf = conf || {};

	this.view = new LoginView();
	this.model = new LoginModel({ parameters : this.conf.parameters});

	this.response = function(){
		this[this.conf.funcionalidad](this.conf.req,this.conf.res,this.conf.next);
	}
}

//Valida credenciales de usuario
Login.prototype.post_validacredenciales = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var objCredenciales = {
        usuario: req.body.usuario,
        password: req.body.password
    };

    this.model.validacredenciales(objCredenciales, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.validacredenciales(res, object);
    });
}

module.exports = Login;
var sql = require('mssql'),
    config = {};

var Login = function (config) {
    //Inicializamos el objeto config
    this.config = config || {};
    //Inicializamos la conexión
    connectionString = {
        user: this.config.parameters.SQL_user,
        password: this.config.parameters.SQL_password,
        server: this.config.parameters.SQL_server, // You can use 'localhost\\instance' to connect to named instance 
        database: this.config.parameters.SQL_database,
        connectionTimeout: this.config.parameters.SQL_connectionTimeout
    };

    this.connection = new sql.Connection(connectionString);
};


Login.prototype.validacredenciales = function (objCredenciales, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('usuario', sql.VarChar(250), objCredenciales.usuario);
        request.input('contrasena', sql.VarChar(50), objCredenciales.password);
        request.execute('SEL_VALIDA_CREDENCIALES_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al validar las credenciales: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

module.exports = Login;
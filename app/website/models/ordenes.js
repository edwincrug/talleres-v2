var sql = require('mssql'),
    config = {};

var Orden = function (config) {
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


Orden.prototype.ordenesporcobrar = function (callback) {

    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        
        request.execute('SEL_ORDENES_POR_COBRAR_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener las órdenes: ' + err);
            }
        });
    });
};

Orden.prototype.trabajocobrado = function (objTrabajoCobrado, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idTrabajo', sql.Numeric(18, 0), objTrabajoCobrado.idTrabajo);
        request.execute('INS_TRABAJO_CONCLUIDO_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al actualizar el trabajo cobrado: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

module.exports = Orden;
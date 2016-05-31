var sql = require('mssql'),
    config = {};

//configuración genérica para modelo de acceso a datos
var DataAccess2 = function(config) {
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
    this.types = {
        INT: sql.Int,
        DECIMAL: sql.Decimal(18, 2),
        STRING: sql.VarChar(8000),
        DATE: sql.DateTime
    }
    this.connection = new sql.Connection(connectionString);
};

//método genérico para acciones get
DataAccess2.prototype.query = function(stored, params, callback) {
    var self = this.connection;
    this.connection.connect(function(err) {
        // Stored Procedure
        var request = new sql.Request(self);
        // Add inputs
        if(params.length > 0){
            params.forEach(function(param) {
                request.input(param.name, param.type, param.value);
            });
        }

        request.execute(stored)
            .then(function(recordsets) {
                callback(null, recordsets[0]);
            }).catch(function(err) {
                callback(err);
            });
    });
};

//método genérico para acciones post
DataAccess2.prototype.post = function (stored,params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        
        if(params.length > 0){
            params.forEach(function(param) {
                request.input(param.name, param.type, param.value);
            });
        }
        request.execute(stored, function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error: ' + params + ' mensaje: ' + err);
            }
        });
    });
};

DataAccess2.prototype.evidencia = function (msgObj, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        for (var i = 0; i < msgObj.length; i++) {
            // Stored Procedure 
            var request = new sql.Request(self);
            request.stream = true;
            request.input('idTipoEvidencia', sql.Numeric(18, 0), msgObj[i].idTipoEvidencia);
            request.input('idTipoArchivo', sql.Numeric(18, 0), msgObj[i].idTipoArchivo);
            request.input('idUsuario', sql.Numeric(18, 0), msgObj[i].idUsuario);
            request.input('idProcesoEvidencia', sql.Numeric(18, 0), msgObj[i].idProcesoEvidencia);
            request.input('nombreArchivo', sql.VarChar(100), msgObj[i].nombreArchivo);
            request.input('idCategoria', sql.Numeric(18, 0), msgObj[i].idCategoria);
            request.input('idNombreEspecial', sql.Numeric(18, 0), msgObj[i].idNombreEspecial);
            request.execute('INS_EVIDENCIA_SP', function (err, recordsets, returnValue) {

            });
        }

        request.on('done', function (returnValue, affected) {
            callback(null, returnValue);
        });

        request.on('error', function (err) {
            callback(err, null);
            console.log('Error al insertar evidencia, mensaje: ' + err);
        });
    });
};

//exportación del modelo
module.exports = DataAccess2; 
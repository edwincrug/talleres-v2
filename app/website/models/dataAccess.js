var sql = require('mssql'),
    config = {};

var DataAccess = function(config){
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


////HTTPSServer methods
//DataAccess.prototype.get = function(stored,params,callback){
//    
//    var self = this.connection;
//    this.connection.connect(function(err) {
//      var request = new sql.Request(self);
//      if(params != null){
//         // Stored Procedure   
//          var dataType = null;
//          if(params.type === 1){
//            dataType = sql.Int;
//          }else if(params.type === 2){
//            dataType = sql.Decimal(18, 2);
//          }else if(params.type === 3){
//            dataType = sql.VarChar(8000);
//          }else if(params.type === 4){
//            dataType = sql.DateTime;
//          }
//          request.input(params.name, dataType, params.value);
//      }
//  
//      // request.output('output_parameter', sql.VarChar(50));
//      request.execute(stored, function(err, recordsets, returnValue) {
//        if(recordsets != null){
//          callback(err, recordsets[0]);
//        }
//        else{
//          console.log('Error al obtener datos para el usuario: ' + params + ' mensaje: ' + err);
//        }
//      });
//
//    });
//};

DataAccess.prototype.get = function(config) {
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

//método post
DataAccess.prototype.post = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idUnidad', sql.Numeric(18, 0), objParams.idUnidad);
        request.input('idTaller', sql.Numeric(18, 0), objParams.idTaller);
        request.input('fecha', sql.VarChar(20), objParams.fecha);
        request.input('trabajo', sql.VarChar(500), objParams.trabajo);
        request.input('observacion', sql.VarChar(1000), objParams.observacion);
        request.input('idUsuario', sql.Numeric(18, 0), objParams.idUsuario);

        request.execute('INS_CITA_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al realizacion la insercción: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

//método post
DataAccess.prototype.postCitaServicioDetalle = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), objParams.idCita);
        request.input('idTipoElemento', sql.Numeric(18, 0), objParams.idTipoElemento);
        request.input('idElemento', sql.Numeric(18, 0), objParams.idElemento);
        request.input('cantidad', sql.Numeric(18, 0), objParams.cantidad);

        request.execute('INS_CITA_SERVICIO_DETALLE_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al realizacion la insercción: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

//método post
DataAccess.prototype.postConfirmarCita = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), objParams.idCita);

        request.execute('INS_CONFIRMACION_CITA_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al realizacion la insercción: ' + objParams + ' mensaje: ' + err);
            }
        });

    });
};

//método post
DataAccess.prototype.postBuscaCita = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('fecha', sql.VarChar(10), objParams.fecha);
        request.input('idCita', sql.Numeric(18, 0), objParams.idCita);

        request.execute('SEL_CITA_TALLER_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al realizacion la insercción: ' + objParams + ' mensaje: ' + err);
            }
        });

    });
};

//realiza la actualización del trabajo a estatus terminado
DataAccess.prototype.updterminaTrabajo = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idTrabajo', sql.Numeric(18, 0), objParams.idTrabajo);
        request.input('observacion', sql.VarChar(1000), objParams.observacion);

        request.execute('UPD_TERMINA_TRABAJO_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error la realizar la actualización: ' + objParams + ' mensaje: ' + err);
            }
        });

    });
};

//realiza la actualización de trabajo a cerrado
DataAccess.prototype.updCierraTrabajo = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idTrabajo', sql.Numeric(18, 0), objParams.idTrabajo);

        request.execute('UPD_TRABAJO_APROBADO_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error la realizar la actualización: ' + objParams + ' mensaje: ' + err);
            }
        });

    });
};

//realiza la actualización de trabajo a facturado
DataAccess.prototype.updFacturaTrabajo = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idTrabajo', sql.Numeric(18, 0), objParams.idTrabajo);

        request.execute('UPD_TRABAJO_FACTURADO_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error la realizar la actualización: ' + objParams + ' mensaje: ' + err);
            }
        });

    });
};

//TimeLine
DataAccess.prototype.timeLine = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), objParams.idCita);

        request.execute('SEL_TIMELINE_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener timeLine: ' + objParams + ' mensaje: ' + err);
            }
        });

    });
};

//obtiene la información de unidad
DataAccess.prototype.unidadInfor = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCliente', sql.Numeric(18, 0), objParams.idCliente);
        request.input('datoUnidad', sql.VarChar(500), objParams.datoUnidad);

        request.execute('SEL_UNIDAD_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener timeLine: ' + objParams + ' mensaje: ' + err);
            }
        });

    });
};

//inserta el trabajo
DataAccess.prototype.insertTrabajo = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), objParams.idCita);
        request.input('idUsuario', sql.Numeric(18, 0), objParams.idUsuario);
        request.input('idUnidad', sql.Numeric(18, 0), objParams.idUnidad);

        request.execute('INS_TRABAJO_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al insertar el trabajo: ' + objParams + ' mensaje: ' + err);
            }
        });
    });
};
       

//actualiza el trabajo a estatus HojaCalidad
DataAccess.prototype.updHojaCalidadTrabajo = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idTrabajo', sql.Numeric(18, 0), objParams.idTrabajo);

        request.execute('UPD_TRABAJO_HOJACALIDAD_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener timeLine: ' + objParams + ' mensaje: ' + err);
            }
        });
    });
};

module.exports = DataAccess; 
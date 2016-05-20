var sql = require('mssql'),
    config = {};

var Cotizacion = function (config) {
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


//Funciones
Cotizacion.prototype.get = function (callback) {

    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        //request.input('idTaller', sql.Int, params);
        // request.output('output_parameter', sql.VarChar(50));
        request.execute('SEL_COTIZACIONES_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener las cotizaciones: ' + err);
            }
        });
    });
};

Cotizacion.prototype.buscarPieza = function (msgObj, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idTaller', sql.Numeric(18, 0), msgObj.idTaller);
        request.input('nombrePieza', sql.VarChar(50), msgObj.nombrePieza);
        request.execute('SEL_BUSQUEDA_PIEZA_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener las piezas: ' + params + ' mensaje: ' + err);
            }
        });
    });
};

Cotizacion.prototype.cotizacionMaestro = function (msgObj, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), msgObj.idCita);
        request.input('idUsuario', sql.Numeric(18, 0), msgObj.idUsuario);
        request.input('observaciones', sql.VarChar(300), msgObj.observaciones);
        request.input('idUnidad', sql.Numeric(18, 0), msgObj.idUnidad);
        request.execute('INS_COTIZACION_MAESTRO_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al insertar cotización: ' + msgObj + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.cotizacionDetalle = function (msgObj, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCotizacion', sql.Numeric(18, 0), msgObj.idCotizacion);
        request.input('idTipoElemento', sql.Numeric(18, 0), msgObj.idTipoElemento);
        request.input('idElemento', sql.Numeric(18, 0), msgObj.idElemento);
        request.input('precio', sql.Decimal(18, 0), msgObj.precio);
        request.input('cantidad', sql.Numeric(18, 0), msgObj.cantidad);
        request.execute('INS_COTIZACION_DETALLE_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al insertar cotización: ' + msgObj + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.buscar = function (callback) {

    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        //request.input('idTaller', sql.Int, params);
        // request.output('output_parameter', sql.VarChar(50));
        request.execute('SEL_BUSQUEDA_COTIZACION_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener las piezas  : ' + params + ' mensaje: ' + err);
            }
        });
    });
};

Cotizacion.prototype.detail = function (objCotizacion, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCotizacion', sql.Numeric(18, 0), objCotizacion.idCotizacion);
        request.input('idTaller', sql.Numeric(18, 0), objCotizacion.idTaller);
        request.execute('SEL_COTIZACION_DETALLE_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener el detalle de la cotización: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.chat = function (params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), params);
        request.execute('SEL_CHAT_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener el chat de la cotización: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.message = function (msgObj, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idUsuario', sql.Numeric(18, 0), msgObj.idUsuario);
        request.input('mensaje', sql.VarChar(300), msgObj.mensaje);
        request.input('idCita', sql.Numeric(18, 0), msgObj.idCita);
        request.execute('INS_MENSAJE_CHAT_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al enviar mensaje: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.ficha = function (params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), params);
        request.execute('SEL_FICHA_TECNICA_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener la ficha técnica de la cotización: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.cotizacionByTrabajo = function (params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), params);
        request.execute('SEL_COTIZACIONES_BY_TRABAJO_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener las cotizaciones de este trabajo: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.aprobacionCotizacion = function (aprobacionObj, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCotizacion', sql.Numeric(18, 0), aprobacionObj.idCotizacion);
        request.input('idUsuario', sql.Numeric(18, 0), aprobacionObj.idUsuario);
        request.input('comentarios', sql.VarChar(300), aprobacionObj.comentarios);
        request.execute('INS_AUTORIZACION_COTIZACION_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al autorizar la cotización: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.evidencia = function (msgObj, callback) {
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

Cotizacion.prototype.evidenciasByCotizacion = function (params, callback) {

    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCotizacion', sql.Numeric(18, 0), params);
        request.execute('SEL_EVIDENCIAS_BY_COTIZACION_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener las evidencias: ' + err);
            }
        });
    });
};

Cotizacion.prototype.rechazoCotizacion = function (rechazoObj, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCotizacion', sql.Numeric(18, 0), rechazoObj.idCotizacion);
        request.input('idUsuario', sql.Numeric(18, 0), rechazoObj.idUsuario);
        request.input('comentarios', sql.VarChar(300), rechazoObj.comentarios);
        request.execute('INS_RECHAZO_COTIZACION_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al rechazar la cotización: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.updateCotizacion = function (msgObj, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCotizacion', sql.Numeric(18, 0), msgObj.idCotizacion);
        request.input('idTipoElemento', sql.Numeric(18, 0), msgObj.idTipoElemento);
        request.input('idElemento', sql.Numeric(18, 0), msgObj.idElemento);
        request.input('precio', sql.Decimal(18, 0), msgObj.precio);
        request.input('cantidad', sql.Numeric(18, 0), msgObj.cantidad);
        request.input('observaciones', sql.VarChar(300), msgObj.observaciones);
        request.input('idEstatus', sql.Numeric(18, 0), msgObj.idEstatus);
        request.execute('UPD_COTIZACION_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al rechazar la cotización: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.docs = function (params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure
        var request = new sql.Request(self);
        request.input('idCotizacion', sql.Numeric(18, 0), params);
        request.execute('SEL_EVIDENCIA_DOCUMENTO_BY_COTIZACION_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener los documentos de la cotización: ' + params + ' mensaje: ' + err);
            }
        });
    });
};

Cotizacion.prototype.servicioDetalle = function (params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), params);
        request.execute('SEL_SERVICIO_DETALLE_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener el servicio de la cotización: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.mail = function (objMail, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCotizacion', sql.Numeric(18, 0), objMail.idCotizacion);
        request.input('idTaller', sql.Numeric(18, 0), objMail.idTaller);
        request.input('idOperacion', sql.Numeric(18, 0), objMail.idOperacion);
        request.input('comentarios', sql.VarChar(300), objMail.comentarios);
        request.execute('SEL_NOTIFICACION_COTIZACION_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al enviar mail: ' + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.datosCliente = function (params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCita', sql.Numeric(18, 0), params);
        request.execute('SEL_DATOS_CLIENTE_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener los datos del cliente: ' + params + ' mensaje: ' + err);
            }
        });

    });
};

Cotizacion.prototype.evidenciasByOrden = function (params, callback) {

    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idTrabajo', sql.Numeric(18, 0), params);
        request.execute('SEL_EVIDENCIAS_BY_TRABAJO_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener las evidencias: ' + err);
            }
        });
    });
};

Cotizacion.prototype.datosUnidad = function (params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idCotizacion', sql.Numeric(18, 0), params.idCotizacion);
        request.input('idTrabajo', sql.Numeric(18, 0), params.idTrabajo);
        request.execute('SEL_DATOS_UNIDAD_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al obtener los datos de la unidad: ' + err);
            }
        });
    });
};

module.exports = Cotizacion;
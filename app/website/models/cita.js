var sql = require('mssql'),
config = {};

var Cita = function(config){
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
/*Cita.prototype.get = function(params,callback){
    var moment = require('moment');
    var responseDate = moment(params).format('YYYY-MM-DD HH:mm Z');
    var date = new Date(responseDate); 
    date.setHours(12);  
    var self = this.connection;
    this.connection.connect(function(err) {
      // Stored Procedure 
      var request = new sql.Request(self);         
      request.input('fecha', sql.DateTime, date);
      request.execute('SEL_CITA_TALLER_SP', function(err, recordsets, returnValue) {
        if(recordsets != null){
          callback(err, recordsets[0]);
        }
        else{
          console.log('Error al obtener datos para el usuario: ' + params + ' mensaje: ' + err);
        }
      });

    });
};*/

module.exports = Cita; 
var Cita = function(conf){
	conf = conf || {};
}

function logError(err, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Error: " + err);
    res.end("");
}

Cita.prototype.see = function(res, object){
	//Estándar de implementación de errores
	if (object.error) { logError(object.error, res); return; }
	
	if (object.result) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify(object.result));
		res.end("");
	}
}

//expone los métodos post
Cita.prototype.post = function (res, object) {
    //Estándar de implementación de errores
    if (object.error) {
        logError(object.error, res);
        return;
    }

    if (object.result) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(object.result));
        res.end("");
    }
}

Cita.prototype.add = function(res, object){
	
}

Cita.prototype.edit = function(res, object){
	
}

Cita.prototype.del = function(res, object){
	
}

module.exports = Cita; 

var Orden = function (conf) {
    conf = conf || {};
}

function logError(err, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write("Error: " + err);
    res.end("");
}

Orden.prototype.ordenesporcobrar = function (res, object) {
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

Orden.prototype.trabajocobrado = function (res, object) {
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

module.exports = Orden;
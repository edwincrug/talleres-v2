var Cotizacion = function (conf) {
    conf = conf || {};
}

function logError(err, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write("Error: " + err);
    res.end("");
}

Cotizacion.prototype.see = function (res, object) {
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

Cotizacion.prototype.buscarPieza = function (res, object) {
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

Cotizacion.prototype.buscarItems = function (res, object) {
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

Cotizacion.prototype.cotizacionMaestro = function (res, object) {
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

Cotizacion.prototype.cotizacionDetalle = function (res, object) {
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

Cotizacion.prototype.uploadFile = function (res, object) {
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

Cotizacion.prototype.buscar = function (res, object) {
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

Cotizacion.prototype.detail = function (res, object) {
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

Cotizacion.prototype.chat = function (res, object) {
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

Cotizacion.prototype.message = function (res, object) {
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

Cotizacion.prototype.ficha = function (res, object) {
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

Cotizacion.prototype.cotizacionByTrabajo = function (res, object) {
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


Cotizacion.prototype.aprobacionCotizacion = function (res, object) {
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

Cotizacion.prototype.evidencia = function (res, object) {
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

Cotizacion.prototype.evidenciasByCotizacion = function (res, object) {
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

Cotizacion.prototype.rechazoCotizacion = function (res, object) {
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

Cotizacion.prototype.updateCotizacion = function (res, object) {
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

Cotizacion.prototype.docs = function (res, object) {
   //Estándar de implementación de errores
   if (object.error) {
       logError(object.error, res);
       return;
   }    if (object.result) {
       res.writeHead(200, {
           'Content-Type': 'application/json'
       });
       res.write(JSON.stringify(object.result));
       res.end("");
   }
}

Cotizacion.prototype.servicioDetalle = function (res, object) {
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

Cotizacion.prototype.mail = function (res, object) {
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

Cotizacion.prototype.datosCliente = function (res, object) {
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

Cotizacion.prototype.evidenciasByOrden = function (res, object) {
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

Cotizacion.prototype.datosUnidad = function (res, object) {
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

module.exports = Cotizacion;
var searchUrl = global_settings.urlCORS + '/api/cotizacion/';

registrationModule.factory('cotizacionAutorizacionRepository', function ($http) {
    return {
        getChat: function (idCita) {
            return $http({
                url: searchUrl + 'chat',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putMessage: function (usuario, msg, cita) {
            var msgObj = {
                idUsuario: usuario,
                mensaje: msg,
                idCita: cita
            };

            return $http({
                url: searchUrl + 'message',
                method: "POST",
                data: msgObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getFichaTecnica: function (idCita) {
            return $http({
                url: searchUrl + 'ficha',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCotizacionByTrabajo: function (idCita) {
            return $http({
                url: searchUrl + 'cotizacionByTrabajo',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putCotizacionAprobacion: function (cotizacion, usuario, comentario) {
            var aprobacionObj = {
                cotizacion: cotizacion,
                usuario: usuario,
                comentarios: comentario
            };

            return $http({
                url: searchUrl + 'cotizacionAprobacion',
                method: "POST",
                data: aprobacionObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getEvidenciasByCotizacion: function (idCotizacion) {
            return $http({
                url: searchUrl + 'evidenciasByCotizacion',
                method: "GET",
                params: {
                    idCotizacion: idCotizacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putCotizacionRechazo: function (cotizacion, usuario, comentario) {
            var rechazoObj = {
                cotizacion: cotizacion,
                usuario: usuario,
                comentarios: comentario
            };

            return $http({
                url: searchUrl + 'cotizacionRechazo',
                method: "POST",
                data: rechazoObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDocs: function (idCotizacion) {
            return $http({
                url: searchUrl + 'docs/' + idCotizacion,
                method: "GET"
            });
        },
        getDatosCliente: function (idCita) {
            return $http({
                url: searchUrl + 'datosCliente',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
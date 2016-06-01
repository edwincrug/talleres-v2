var searchUrl = global_settings.urlCORS + '/api/cotizacion/';
var ordenUrl = global_settings.urlCORS + '/api/ordenes/';

registrationModule.factory('ordenServicioRepository', function ($http) {
    return {
        getChat: function (idCita) {
            return $http({
                url: searchUrl + 'chat/' + idCita,
                method: "GET"
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
                url: searchUrl + 'ficha/' + idCita,
                method: "GET"
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
                url: searchUrl + 'evidenciasByCotizacion/' + idCotizacion,
                method: "GET"
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
        getOrdenesPorCobrar: function () {
            return $http({
                url: ordenUrl + 'ordenesporcobrar',
                method: "GET"
            });
        }
    };
});
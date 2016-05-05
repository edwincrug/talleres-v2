var searchUrl = global_settings.urlCORS + '/api/cotizacion/';

registrationModule.factory('cotizacionMailRepository', function ($http) {
    return {
        postMail: function (idCotizacion, idTaller, idOperacion, comentarios) {
            var objMail = {
                cotizacion: idCotizacion,
                taller: idTaller,
                operacion: idOperacion,
                comentario: comentarios
            };

            return $http({
                url: searchUrl + 'mail',
                method: "POST",
                data: objMail,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
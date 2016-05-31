var searchUrl = global_settings.urlCORS + '/api/cotizacion/';

registrationModule.factory('cotizacionEvidenciasRepository', function ($http) {
    return {
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
        }
    };
});
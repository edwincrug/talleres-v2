var searchUrl = global_settings.urlCORS + '/api/cotizacion/';

registrationModule.factory('cotizacionEvidenciasRepository', function ($http) {
    return {
        getEvidenciasByCotizacion: function (idCotizacion) {
            return $http({
                url: searchUrl + 'evidenciasByCotizacion/' + idCotizacion,
                method: "GET"
            });
        }
    };
});
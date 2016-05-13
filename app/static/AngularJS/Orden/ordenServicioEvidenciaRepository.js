var searchUrl = global_settings.urlCORS + '/api/cotizacion/';

registrationModule.factory('ordenServicioEvidenciaRepository', function ($http) {
    return {
        getEvidenciasByOrden: function (idTrabajo) {
            return $http({
                url: searchUrl + 'evidenciasByOrden/' + idTrabajo,
                method: "GET"
            });
        }
    };
});
var trabajoUrl = global_settings.urlCORS + '/api/cita/';

registrationModule.factory('trabajoRepository', function ($http) {
    return {
        getTrabajo: function () {
            return $http.get(trabajoUrl +'unidadtrabajo')
        }
    };
});
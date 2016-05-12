var trabajoUrl = global_settings.urlCORS + '/api/trabajo/';

registrationModule.factory('trabajoRepository', function ($http) {
    return {
        getTrabajo: function () {
            return $http.get(trabajoUrl +'trabajo')
        },
        getTrabajoTerminado: function () {
            return $http.get(trabajoUrl +'trabajoterminado')
        },
        terminaTrabajo: function(idTrabajo, observacion){
            return $http({
                url: trabajoUrl + 'updtrabajoterminado/',
                method: "POST",
                data: {idTrabajo:idTrabajo,observacion : observacion},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        }
    };
});
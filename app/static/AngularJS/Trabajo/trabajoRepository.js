var trabajoUrl = global_settings.urlCORS + '/api/trabajo/';

registrationModule.factory('trabajoRepository', function ($http) {
    return {
        getTrabajo: function(idUsuario){
            return $http({
                url: trabajoUrl + 'trabajo/',
                method: "GET",
                params: {idUsuario: idUsuario},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        getTrabajoTerminado: function(idUsuario){
            return $http({
                url: trabajoUrl + 'trabajoterminado/',
                method: "GET",
                params: {idUsuario: idUsuario},
                headers: {
                'Content-Type': 'application/json'
                }
            });
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
        },
        
        hojaCalidadTrabajo: function(idTrabajo){
            return $http({
                url: trabajoUrl + 'updtrabajohojacalidad/',
                method: "POST",
                data: {idTrabajo: idTrabajo},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        cierraTrabajo: function(idTrabajo){
            return $http({
                url: trabajoUrl + 'updtrabajocerrado/',
                method: "POST",
                data: {idTrabajo:idTrabajo},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        facturaTrabajo: function(idTrabajo){
            return $http({
                url: trabajoUrl + 'updtrabajofacturado/',
                method: "POST",
                data: {idTrabajo:idTrabajo},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        
        },
        getTimeLine: function(idCita){
            return $http({
                url: trabajoUrl + 'timeLine/',
                method: "GET",
                params: {idCita: idCita},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        insertTrabajo: function(idCita,idUsuario,idUnidad){
            return $http({
                url: trabajoUrl + 'insertTrabajo/',
                method: "POST",
                data: {idCita: idCita,idUsuario: idUsuario,idUnidad: idUnidad},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        }
    };
});
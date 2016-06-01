var citaUrl = global_settings.urlCORS + '/api/cita/';

registrationModule.factory('citaRepository', function ($http) {
    return {
        getCliente: function(idUsuario){
            return $http({
                url: citaUrl + 'cliente/',
                method: "GET",
                params: {idUsuario:idUsuario},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getUnidadInformation: function(idCliente, datoUnidad){
            return $http({
                url: citaUrl + 'unidad/',
                method: "GET",
                params: {idCliente: idCliente, datoUnidad: datoUnidad},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        getCita: function(idUnidad, idUsuario){
            return $http({
                url: citaUrl + 'cita/',
                method: "GET",
                params: {idUnidad: idUnidad, idUsuario: idUsuario},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        getTaller: function(datoTaller){
            return $http({
                url: citaUrl + 'taller/',
                method: "GET",
                params: {datoTaller: datoTaller},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        getPaquete: function(idTrabajo){
            return $http({
                url: citaUrl + 'paquete/',
                method: "GET",
                params: {datoTaller: idTrabajo},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        enviarMailConfirmacion: function(idCita){
            return $http({
                url: citaUrl + 'enviaremailcita/',
                method: "GET",
                params: {idCita: idCita},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        getCitaTaller: function(fecha, idCita,idUsuario){
            return $http({
                url: citaUrl + 'buscaCita/',
                method: "GET",
                params: {fecha:fecha,idCita:idCita,idUsuario:idUsuario},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        addCita: function(taller){
            return $http({
                url: citaUrl + 'addcita/',
                method: "POST",
                data: taller,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        addCitaServicioDetalle: function(item){
            return $http({
                url: citaUrl + 'addcitaserviciodetalle/',
                method: "POST",
                data: item,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        validaConfirmacionCita: function(idCita){
            return $http({
                url: citaUrl + 'validaconfirmacioncita/',
                method: "GET",
                params: {idCita: idCita},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        getTrabajo: function(idCita){
            return $http({
                url: citaUrl + 'trabajo/',
                method: "GET",
                params: {idCita: idCita},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        }
    };
});
var citaUrl = global_settings.urlCORS + '/api/cita/';

registrationModule.factory('citaRepository', function ($http) {
    return {
        getCliente: function(){
            return $http({
                url: citaUrl + 'cliente/',
                method: "GET"
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
        getCita: function(idUnidad){
            return $http({
                url: citaUrl + 'cita/',
                method: "GET",
                params: {idUnidad: idUnidad},
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
        getCitaTaller: function(fecha, idCita){
            return $http({
                url: citaUrl + 'buscaCita/',
                method: "GET",
                params: {fecha:fecha,idCita:idCita},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        getTrabajo: function(idCita){
        	return $http.get(citaUrl+'trabajo/'+idCita);
        },
        getCotizacion: function(idTrabajo){
        	return $http.get(citaUrl+'cotizacion/'+idTrabajo);
        },
        getCotizacionDetalle: function(idTrabajo){
        	return $http.get(citaUrl+'cotizaciondetalle/'+idTrabajo);
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
        getHistorialCita: function (idCita) {
            return $http.get(citaUrl +'historialcita/'+ idCita);
        },
        getHistorialTrabajo: function (idTrabajo) {
            return $http.get(citaUrl +'historialtrabajo/'+ idTrabajo);
        },
        getHistorialCotizacion: function (idTrabajo) {
            return $http.get(citaUrl +'historialcotizacion/'+ idTrabajo);
        },
        confirmarCita: function(idCita){
            var msgObj = {
                idCita: idCita
            }
            return $http({
                url: citaUrl + 'citaconfirmada/',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        validaConfirmacionCita: function(idCita){
            return $http.get(citaUrl +'validaconfirmacioncita/'+ idCita)
        }
    };
});
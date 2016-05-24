var citaUrl = global_settings.urlCORS + '/api/cita/';

registrationModule.factory('citaRepository', function ($http) {
    return {
        getCitaTaller: function(fecha, idCita){
        var msgObj = {
                fecha: fecha,
                idCita: idCita
        }
            return $http({
                url: citaUrl + 'buscaCita/',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        getCita: function(idUnidad){
        	return $http.get(citaUrl+'cita/'+idUnidad);
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
        getPaquete: function(idTrabajo){
        	return $http.get(citaUrl+'paquete/'+idTrabajo);
        },
        getTaller: function(datoTaller){
        	return $http.get(citaUrl+'taller/'+datoTaller);
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
                url: citaUrl + 'addCitaServicioDetalle/',
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
        enviarMailConfirmacion: function (idCita) {
            return $http.get(citaUrl +'enviaremailcita/'+ idCita);
        },
        validaConfirmacionCita: function(idCita){
            return $http.get(citaUrl +'validaconfirmacioncita/'+ idCita)
        },
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
        }
    };
});
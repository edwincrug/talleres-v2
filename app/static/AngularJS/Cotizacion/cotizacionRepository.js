var searchUrl = global_settings.urlCORS + '/api/cotizacion/';
var ruta = global_settings.uploadPath;
//var ruta = 'C:/Users/Mario/Documents/FileUpload';

registrationModule.factory('cotizacionRepository', function ($http) {
    return {
        buscarPieza: function(idTaller,nombrePieza){
            var msgObj = {
                idTaller: idTaller,
                nombrePieza: nombrePieza
            }
            return $http({
                url: searchUrl + 'buscarPieza',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },   
        insertCotizacionMaestro: function(idCita,idUsuario,observaciones,idUnidad){
            var msgObj = {
                idCita: idCita,  
                idUsuario: idUsuario,
                observaciones: observaciones,
                idUnidad: idUnidad
            }
            return $http({
                url: searchUrl + 'cotizacionMaestro',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        insertCotizacionDetalle: function(idCotizacion,idTipoElemento,idElemento,precio,cantidad){
            var msgObj = {
                idCotizacion: idCotizacion,  
                idTipoElemento: idTipoElemento,
                idElemento: idElemento,
                precio: precio,
                cantidad: cantidad
            }
            return $http({
                url: searchUrl + 'cotizacionDetalle',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        insertEvidencia: function(idTipoEvidencia,idTipoArchivo,idUsuario,idProcesoEvidencia,nombreArchivo){
            var msgObj = {
                idTipoEvidencia: idTipoEvidencia,  
                idTipoArchivo: idTipoArchivo,
                idUsuario: idUsuario,
                idProcesoEvidencia: idProcesoEvidencia,
                nombreArchivo: nombreArchivo
            }
            return $http({
                url: searchUrl + 'evidencia',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },  
        editarCotizacion: function(idCotizacion,idTaller){
            var msgObj = {
                idCotizacion: idCotizacion,  
                idTaller: idTaller
            }
            return $http({
                url: searchUrl + 'detail',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        updateCotizacion: function(idCotizacion,idTipoElemento,idElemento,precio,cantidad,observaciones,idEstatus){
            var msgObj = {
                idCotizacion: idCotizacion,  
                idTipoElemento: idTipoElemento,
                idElemento: idElemento,
                precio: precio,
                cantidad: cantidad,
                observaciones: observaciones,
                idEstatus: idEstatus
            }
            return $http({
                url: searchUrl + 'updateCotizacion',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        busquedaServicioDetalle: function(idCita){
            return $http({
                url: searchUrl + 'servicioDetalle/' + idCita,
                method: "GET"
            });
        }
    };
});
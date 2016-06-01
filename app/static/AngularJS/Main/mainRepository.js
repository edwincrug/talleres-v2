var searchUrl = global_settings.urlCORS + '/api/cotizacion/';

registrationModule.factory('mainRepository', function ($http) {
    return {
        getChat: function (idCita) {
            return $http({
                url: searchUrl + 'chat',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putMessage: function (usuario, msg, cita) {
            var msgObj = {
                idUsuario: usuario,
                mensaje: msg,
                idCita: cita
            };

            return $http({
                url: searchUrl + 'message',
                method: "POST",
                data: msgObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
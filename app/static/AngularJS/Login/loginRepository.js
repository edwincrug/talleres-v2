var loginUrl = global_settings.urlCORS + '/api/login/';

registrationModule.factory('loginRepository', function ($http) {
    return {
        login: function(usuario, password){
        var msgObj = {
                usuario: usuario,
                password: password
        }
            return $http({
                url: citaUrl + 'validaCredenciales/',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        }
    };
});
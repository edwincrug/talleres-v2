var loginUrl = global_settings.urlCORS + '/api/login/';

registrationModule.factory('loginRepository', function ($http) {
    return {
        login: function(usuario, password){
            return $http({
                url: loginUrl + 'validaCredenciales/',
                method: "GET",
                params: {usuario:usuario,password:password},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        }
    };
});
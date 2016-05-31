registrationModule.controller('loginController', function ($scope, alertFactory, $rootScope, localStorageService, loginRepository) {
    $rootScope.sesion = 0;
    $rootScope.showChat = 0;
    
    $scope.init = function () {

    }

    $scope.login = function (username, password) {
        loginRepository.login(username, password)
            .then(function (result) {
                if (result.data.length > 0) {
                    alertFactory.success('Bienvenido a Talleres: ' + result.data[0].nombreCompleto);
                    $scope.login = result.data[0];
                    localStorageService.set('userData', $scope.login);

                    if ($scope.login.idTipoUsuario == 3) {
                        location.href = '/tallercita';
                    } else {
                        location.href = '/cita';
                    }
                } else {
                    alertFactory.info('Valide el usuario y/o contraseña');
                }
            }, function (error) {
                alertFactory.error('Error');
            });
    }
});
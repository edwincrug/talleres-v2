registrationModule.controller('loginController', function ($scope, alertFactory, $rootScope, localStorageService, loginRepository) {
    $rootScope.sesion = 0;

    $scope.init = function () {

    }

    $scope.login = function (username, password) {
        loginRepository.login(username, password)
            .then(function (result) {
                if (result.data.length > 0) {
                    alertFactory.success('Bienvenido a Talleres: ' + result.data[0].nombreCompleto);
                    $scope.login = result.data;
                    localStorageService.set('login', $scope.login);
                    location.href = '/cita';
                } else {
                    alertFactory.info('Valide el usuario y/o contraseña');
                }

            }, function (error) {
                alertFactory.error('Error');
            });
    }
});
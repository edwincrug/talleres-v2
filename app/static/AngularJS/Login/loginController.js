registrationModule.controller('loginController', function ($scope, alertFactory, $rootScope, loginRepository) {
    $rootScope.sesion = 0;

    $scope.init = function () {

    }

    $scope.login = function (username, password) {
        loginRepository.login(username, password)
            .then(function (result) {
                if (result.length > 0) {
                    alertFactory.success('Bienvenido a Talleres: ' + result.data[0].nombreCompleto);
                } else {
                    alertFactory.error('Valide el usuario y/o contraseña');
                }

            }, function (error) {
                alertFactory.error('Error');
            });
    }
});
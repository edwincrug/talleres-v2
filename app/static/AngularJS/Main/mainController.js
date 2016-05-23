registrationModule.controller('mainController', function ($scope, $rootScope, $location, localStorageService, mainRepository) {
    $rootScope.showChat = 0;
    var citaMsg = localStorageService.get('citaMsg');
    $scope.descripcion = localStorageService.get('desc');
    $scope.comentarios = '';

    $scope.init = function () {
        $scope.cargaChat();
        $rootScope.userData = localStorageService.get('userData');
    }

    $scope.cargaChat = function () {
        if (citaMsg !== null) {
            mainRepository.getChat(citaMsg).then(function (result) {
                if (result.data.length > 0) {
                    $scope.chat = result.data;
                }
            }, function (error) {});
        }
    }

    $scope.EnviarComentario = function (comentarios) {
        mainRepository.putMessage($rootScope.userData.idUsuario, comentarios, citaMsg).then(function (result) {
                $scope.algo = result.data;
                $scope.clearComments();
                $scope.cargaChat();

            },
            function (error) {});
    }

    $scope.clearComments = function () {
        $scope.comentarios = '';
    }
});
registrationModule.controller('mainController', function ($scope, $rootScope, $location, localStorageService, mainRepository) {
    $rootScope.showChat = 0;
    $scope.idUsuario = 3;
    var idCita = localStorageService.get('cita');
    $scope.descripcion = localStorageService.get('desc');
    $scope.comentarios = '';

    $scope.init = function () {
        $scope.cargaChat();
    }

    $scope.cargaChat = function () {
        mainRepository.getChat(idCita).then(function (result) {
            if (result.data.length > 0) {
                $scope.chat = result.data;
            }
        }, function (error) {});
    }

    $scope.EnviarComentario = function (comentarios) {
        mainRepository.putMessage(3, comentarios, idCita).then(function (result) {
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
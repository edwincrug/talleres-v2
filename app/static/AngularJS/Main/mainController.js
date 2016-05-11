registrationModule.controller('mainController', function ($scope, $rootScope, $location, mainRepository) {
    $scope.showChat = $location.path();
    
    $scope.init = function () {
        
        $scope.cargaChat();
    }

    $scope.cargaChat = function () {
            mainRepository.getChat(5).then(function (result) {
                $scope.chat = result.data;
            }, function (error) {});
    }

    $scope.EnviarComentario = function (comentarios) {
        mainRepository.putMessage(3, comentarios, idCita).then(function (result) {
                $scope.algo = result.data;
                $scope.cargaChat();
            },
            function (error) {});
    }
});
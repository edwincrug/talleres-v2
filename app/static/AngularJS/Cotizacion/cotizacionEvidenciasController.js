registrationModule.controller('cotizacionEvidenciasController', function ($scope, localStorageService, alertFactory, cotizacionEvidenciasRepository) {

    $scope.init = function () {
        $scope.cargaEvidencias();
    }

    $scope.cargaEvidencias = function () {
        cotizacionEvidenciasRepository.getEvidenciasByCotizacion(5).then(function (result) {
            if (result.data.length > 0) {
                $scope.slides = result.data;
            } else {
                $scope.alerta = 1;
            }
        }, function (error) {});
    }

});
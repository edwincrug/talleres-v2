registrationModule.controller('cotizacionEvidenciasController', function ($scope, localStorageService, alertFactory, cotizacionEvidenciasRepository) {

    $scope.init = function () {
        $scope.cargaEvidencias();
    }

    $scope.cargaEvidencias = function () {
        cotizacionEvidenciasRepository.getEvidenciasByCotizacion(38).then(function (result) {
            if (result.data.length > 0) {
                $scope.slides = result.data;
                setTimeout(function () {
                    $scope.efectoEvidencias();
                }, 1000)
            } else {
                $scope.alerta = 1;
            }
        }, function (error) {});
    }

    $scope.efectoEvidencias = function () {
        $('.file-box').each(function () {
            animationHover(this, 'pulse');
        });
    }
    
    $scope.openEvidencia = function(){
        document.getElementById("myNav").style.width = "100%";
    }
    
    $scope.adjuntarEvidencia = function(){
        $('#cotizacionDetalle').appendTo('body').modal('show');
    }
});
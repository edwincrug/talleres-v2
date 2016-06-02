registrationModule.controller('ordenServicioEvidenciaController', function ($scope, localStorageService, alertFactory, ordenServicioEvidenciaRepository) {
    var idCotizacion = localStorageService.get('cotizacion');
    var trabajo = localStorageService.get('objTrabajo');
    if (trabajo.idTrabajo == null) {
        $scope.idTrabajo = trabajo[0].idTrabajo;
    } else {
        $scope.idTrabajo = trabajo.idTrabajo;
    }

    $scope.init = function () {
        $scope.cargaEvidencias();
    }

    $scope.cargaEvidencias = function () {
        ordenServicioEvidenciaRepository.getEvidenciasByOrden($scope.idTrabajo).then(function (result) {
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

    $scope.openEvidencia = function () {
        document.getElementById("myNav").style.width = "100%";
    }

    $scope.adjuntarEvidencia = function () {
        $('#cotizacionDetalle').appendTo('body').modal('show');
    }

    $scope.setValFiltro = function (val) {
        $scope.filtro = {};
        //$scope.filtro.idTipoArchivo = 0;
        $scope.filtro.idTipoArchivo = val;
    }

    //Se realiza la carga de archivos
    $scope.cargarArchivos = function () {
        //Se obtienen los datos de los archivos a subir
        $scope.userData = localStorageService.get('userData');
        formArchivos = document.getElementById("uploader");
        contentForm = (formArchivos.contentWindow || formArchivos.contentDocument);
        if (contentForm.document)
            btnSubmit = contentForm.document.getElementById("submit2");
        elements = contentForm.document.getElementById("uploadForm").elements;
        idTrabajoEdit = contentForm.document.getElementById("idTrabajo");
        idCotizacionEdit = contentForm.document.getElementById("idCotizacion");
        idTipoEvidencia = contentForm.document.getElementById("idTipoEvidencia");
        idUsuario = contentForm.document.getElementById("idUsuario");
        vTrabajo = contentForm.document.getElementById("vTrabajo");
        idCategoria = contentForm.document.getElementById("idCategoria");
        idNombreEspecial = contentForm.document.getElementById("idNombreEspecial");
        idTrabajoEdit.value = $scope.idTrabajo;
        vTrabajo.value = "1";
        idTipoEvidencia.value = 1;
        idCategoria.value = 1;
        idNombreEspecial.value = 0;
        idUsuario.value = $scope.userData.idUsuario;
        //Submit del botón del Form para subir los archivos        
        btnSubmit.click();

        setTimeout(function () {
            $scope.cargaEvidencias();
        }, 2000);
    }
});
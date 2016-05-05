registrationModule.controller('cotizacionTrabajoController', function ($scope, localStorageService, alertFactory, cotizacionAutorizacionRepository, citaRepository, cotizacionRepository, cotizacionMailRepository) {

    var cDetalles = [];
    var cPaquetes = [];
    $scope.chat = [];
    
    $scope.idTrabajoOrden = localStorageService.get('objTrabajo'); 
    $scope.setInterval = 5000;
    $scope.message = "Obteniendo información ...";    
    $scope.descripcion =  $scope.idTrabajoOrden.numeroTrabajo;
    var tipoEvidencia = 1; //Trabajo


    $scope.init = function () {
        $scope.cargaFicha();
        $scope.cargaChat();
        $scope.getCotizacionByTrabajo();
        $scope.lookUpTrabajo($scope.idTrabajoOrden.idCita);
        $scope.cargaEvidencias();
        $scope.cargaDocs($scope.idTrabajoOrden.idCotizacion);
    }

    $scope.cargaChat = function () {
        $scope.promise =
            cotizacionAutorizacionRepository.getChat($scope.idTrabajoOrden.idCita).then(function (result) {
                $scope.chat = result.data;
            }, function (error) {});
    }

    $scope.cargaFicha = function () {
            cotizacionAutorizacionRepository.getFichaTecnica($scope.idTrabajoOrden.idCita).then(function (result) {
                if (result.data.length > 0) {
                    $scope.unidadInfo = result.data[0];
                    localStorageService.set('objFicha', $scope.unidadInfo);
                }
            }, function (error) {});
    }

    $scope.EnviarComentario = function (comentarios) {
        cotizacionAutorizacionRepository.putMessage(3, comentarios, $scope.idTrabajoOrden.idCita).then(function (result) {
                $scope.algo = result.data;
                $scope.cargaChat();
            },
            function (error) {});
    }

    $scope.getCotizacionByTrabajo = function () {
        $scope.promise =
            cotizacionAutorizacionRepository.getCotizacionByTrabajo($scope.idTrabajoOrden.idCita).then(function (result) {
                    $scope.cotizacionesByTrabajo = result.data;
                },
                function (error) {});
    }

    $('#myTabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });

    //obtiene los tabajos de la cita
    $scope.lookUpTrabajo = function (idCita) {
        $scope.promise =
            citaRepository.getTrabajo(idCita).then(function (trabajo) {
                if (trabajo.data.length > 0) {
                    $scope.existsTrabajo = true;
                    //$scope.cita = cita;
                    alertFactory.success('Trabajo cargado');
                    //obtiene las cotizaciones(servicios) de la unidad
                    citaRepository.getCotizacion(trabajo.data[0].idTrabajo).then(function (cotizacion) {
                        if (cotizacion.data.length > 0) {
                            citaRepository.getCotizacionDetalle(trabajo.data[0].idTrabajo).then(function (cotizacionDetalle) {
                                citaRepository.getPaquete(trabajo.data[0].idTrabajo).then(function (cotPaquete) {
                                    getCotizacionDetallePaquete(trabajo.data, cotizacion.data, cotizacionDetalle.data, cotPaquete.data);
                                });
                            });
                        } else {
                            alertFactory.info('No se encontraron cotizaciones');
                        }
                    }, function (error) {
                        alertFactory('Error al obtener las cotizaciones');
                    });
                } else {
                    alertFactory.info('No se encontraron datos del trabajo');
                    $scope.trabajo = [];
                    //$scope.cita = [];
                    //$scope.existsTrabajo = false;
                }

            }, function (error) {
                alertFactory.error("Error al obtener datos del trabajo");
            })
    };

    //Obtiene la lista de trabajo/cotizaciones/detalle/paquete por unidad
    var getCotizacionDetallePaquete = function (trabajo, cotizacion, cotizacionDetalle, paquetes) {
        $scope.trabajo = [];

        //crea una propiedad trabajo y agrega los objetos en el array
        trabajo.forEach(function (t) {
            $scope.trabajo.push({
                trabajo: t
            });
            $scope.trabajo[0].trabajo.cotizacion = cotizacion;
            $scope.trabajo[0].trabajo.cotizacion.forEach(function (c, i) {

                //consulta de cotizaciones detalle
                cDetalles = Enumerable.From(cotizacionDetalle)
                    .Where(function (x) {
                        return x.idCotizacion == c.idCotizacion
                    })
                    .Select(function (x) {
                        return x
                    })
                    .ToArray();
                //añade detalles por cotización
                $scope.trabajo[0].trabajo.cotizacion[i].cotizacionDetalle = cDetalles;

                $scope.trabajo[0].trabajo.cotizacion[i].cotizacionDetalle.forEach(function (cd, j) {
                    //consulta de paquetes de cotización detalle
                    cPaquetes = Enumerable.From(paquetes)
                        .Where(function (x) {
                            return x.idCotizacion == c.idCotizacion && cd.idTipoElemento == 1
                        })
                        .Select(function (x) {
                            return x
                        })
                        .ToArray();
                    if (cPaquetes.length > 0) {
                        $scope.trabajo[0].trabajo.cotizacion[i].cotizacionDetalle[j].paquete = cPaquetes;
                    }
                });
            });
        });
    };

    //expande y contrae las filas de las tablas
    $(function () {
        $('body').on('click', '.CX button', function () {
            if ($(this).text() == '+') {
                $(this).text('-');
            } else {
                $(this).text('+');
            }
            $(this).closest('tr')
                .next('tr')
                .toggle();
        });
    });

    $scope.cargaEvidencias = function () {
            cotizacionAutorizacionRepository.getEvidenciasByCotizacion($scope.idTrabajoOrden.idCotizacion).then(function (result) {
                if (result.data.length > 0) {
                    $scope.slides = result.data;
                } else {
                    $scope.alerta = 1;
                }
            }, function (error) {});
    }

    $scope.nuevaCotizacion = function () {
        localStorageService.set('cita', localStorageService.get('objTrabajo'));
        location.href = '/cotizacionNueva';
    }

    $scope.Adjuntar = function(){
        $('#modal').appendTo('body').modal('show');
    }

    //Se realiza la carga de archivos
    $scope.cargarArchivos = function(){
        //Se obtienen los datos de los archivos a subir
        formArchivos = document.getElementById("uploader");
        contentForm = (formArchivos.contentWindow || formArchivos.contentDocument);
        if (contentForm.document)
            btnSubmit = contentForm.document.getElementById("submit2");                
            elements = contentForm.document.getElementById("uploadForm").elements;
            idTrabajoEdit = contentForm.document.getElementById("idTrabajo");   

            idTrabajoEdit.value = $scope.idTrabajoOrden.idTrabajo;

            for(var i = 0; i < elements.length; i++)
            {
                if(elements[i].value.lastIndexOf(".") > 0){
                    $scope.nombreArchivo = elements[i].value;
                    $scope.tipoArchivo = obtenerExtArchivo($scope.nombreArchivo);
                    $scope.idTipoArchivo = obtenerTipoArchivo($scope.tipoArchivo);                            
                    cotizacionRepository.insertEvidencia(tipoEvidencia,
                                                        $scope.idTipoArchivo,
                                                        1,//$scope.idUsuario,
                                                        $scope.idTrabajoOrden.idTrabajo,
                                                        $scope.nombreArchivo)
                    .then(function(result){ 
                        alertFactory.success('Evidencia Guardada Correctamente');                              
                    },function(error){
                        alertFactory.error('Error');
                    });
                }                        
            }
            //Submit del botón del Form para subir los archivos        
            btnSubmit.click();
            $scope.cargaEvidencias();
            $('#modal').modal('hide');
    }

    //Se obtiene la extensión del archivo
    var obtenerExtArchivo = function (file) {
        $scope.file = file;
        var res = $scope.file.substring($scope.file.length - 4, $scope.file.length)
        return res;
    }

    //Obtener el tipo de archivo
    var obtenerTipoArchivo = function(ext){
        if(ext == '.pdf' || ext == '.doc' || ext == '.xls' || ext == '.docx' || ext == '.xlsx' ||
            ext == '.PDF' || ext == '.DOC' || ext == '.XLS' || ext == '.DOCX' || ext == '.XLSX'
            || ext == '.ppt' || ext == '.PPT'){
            type = 1;
        } else if(ext == '.jpg' || ext == '.png' || ext == '.gif' || ext == '.bmp' || ext == '.JPG' || ext == '.PNG' || ext == '.GIF' || ext == '.BMP'){
            type = 2;
        } else if(ext == '.mp4'){
            type = 3;
        }
        return type;
    }

    //Se obtienen los archivos de la cotización (documentos)
    $scope.cargaDocs = function (idCotizacion) {
        $scope.promise =
            cotizacionAutorizacionRepository.getDocs(idCotizacion).then(function (result) {
                $scope.docs = result.data;
            }, function (error) {});
    }
});
// -- =============================================
// -- Author:      Mario Mejía
// -- Create date: 23/03/2016
// -- Description: trabajo controller
// -- Modificó: Vladimir Juárez Juárez
// -- Fecha: 10/04/2016
// -- =============================================
registrationModule.controller('trabajoController', function ($scope, $rootScope,localStorageService, alertFactory, trabajoRepository) {
    //this is the first method executed in the view
    $scope.init = function () {
        $scope.userData = localStorageService.get('userData');
        getTrabajo($scope.userData.idUsuario);
        getTrabajoTerminado($scope.userData.idUsuario);
        $scope.habilitaBtnAprobar = true;
    }

    var getTrabajo = function (idUsuario) {
        trabajoRepository.getTrabajo(idUsuario).then(function (trabajo) {
            $('.dataTableTrabajo').DataTable().destroy();
            $scope.trabajos = trabajo.data;
            if (trabajo.data.length > 0) {
                waitDrawDocument("dataTableTrabajo");
                alertFactory.success("Trabajos cargados");
            } else {
                alertFactory.info("No se encontraron trabajos");
            }
        }, function (error) {
            alertFactory.error("Error al cargar trabajos");
        });
    }

    //obtiene los trabajos terminados
    var getTrabajoTerminado = function (idUsuario) {
        $('.dataTableTrabajoTerminado').DataTable().destroy();
        trabajoRepository.getTrabajoTerminado(idUsuario).then(function (trabajoTerminado) {
            $scope.trabajosTerminados = trabajoTerminado.data;

            if (trabajoTerminado.data.length) {
                waitDrawDocument("dataTableTrabajoTerminado");
                alertFactory.success("Trabajos terminados cargados");
            } else {
                alertFactory.info("No se encontraron trabajos");
            }
        }, function (error) {
            alertFactory.error("Error al cargar trabajos");
        });
    }

    $scope.aprobarTrabajo = function (trabajo, valBotonera) {
        var objBotonera = {};
        objBotonera.accion = valBotonera;
        objBotonera.idCita = trabajo.idCita;
        localStorageService.set('objTrabajo', trabajo);
        localStorageService.set("botonera", objBotonera);
        location.href = '/ordenservicio';
    }

    //espera que el documento se pinte para llenar el dataTable
    var waitDrawDocument = function (dataTable) {
        setTimeout(function () {
            $('.' + dataTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [
                    {
                        extend: 'copy'
                    },
                    {
                        extend: 'csv'
                    },
                    {
                        extend: 'excel',
                        title: 'ExampleFile'
                    },
                    {
                        extend: 'pdf',
                        title: 'ExampleFile'
                    },

                    {
                        extend: 'print',
                        customize: function (win) {
                            $(win.document.body).addClass('white-bg');
                            $(win.document.body).css('font-size', '10px');

                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('font-size', 'inherit');
                        }
                    }
                ]
            });
        }, 2500);
    }

    //actualiza el trabajo a estatus terminado
    $scope.updTerminaTrabajo = function (observacion) {
        trabajoRepository.terminaTrabajo($scope.idTrabajo, observacion).then(function (trabajoTerminado) {
            if (trabajoTerminado.data[0].idHistorialProceso != 0) {
                getTrabajo($scope.userData.idUsuario);
                getTrabajoTerminado($scope.userData.idUsuario);
                $('#finalizarTrabajoModal').modal('hide');
            }
        });
    }

    //abre el modal para la finalización del trabajo
    $scope.openFinishingTrabajoModal = function (idTrabajo) {
        $('#finalizarTrabajoModal').appendTo("body").modal('show');
        $scope.idTrabajo = idTrabajo;
    }

    var controlTabs = function () {
        $scope.tabs = {
            tab1: false,
            tab2: true
        };
    };

    //confirm del trabajo para su terminación
    $('.btnTerminarTrabajo').click(function () {
        swal({
                title: "¿Está seguro de terminar el trabajo?",
                text: "Se cambiará el estatus del trabajo a TERMINADO",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.updTerminaTrabajo($scope.observacionTrabajo);
                    swal("Trabajo terminado!", "El trabajo se ha terminado", "success");
                    $scope.observacionTrabajo = null;
                } else {
                    swal("Cancelado", "", "error");
                    $('#finalizarTrabajoModal').modal('hide');
                    $scope.observacionTrabajo = null;
                }
            });
    });

//    //sube archivo de la factura
//    $scope.archivoTrabajoModal = function (idTrabajo, hojaCalidad) {
//        $scope.idTrabajo = idTrabajo;
//        $scope.hojaCalidad = hojaCalidad;
//        
//        if(hojaCalidad == 1){
//            $scope.modalTittle = "Hoja de calidad";   
//            $('#cargarHojaModal').appendTo("body").modal('show');
//        }
//        else{
//            $scope.modalTittle = "Factura";
//            $('#cargarFacturaModal').appendTo("body").modal('show');
//        }       
//    }
    
    $scope.adjuntar = function (idTrabajo, hojaCalidad) {
        $scope.idTrabajo = idTrabajo;
        $scope.hojaCalidad = hojaCalidad;
        $('#factura').appendTo('body').modal('show');
    }
    
    $scope.adjuntarHoja = function (idTrabajo) {
        $scope.idTrabajo = idTrabajo;
        $('#hoja').appendTo('body').modal('show');
    }
    
   //Se realiza la carga de archivos de factura
    $scope.cargarArchivos = function () {
       //Se obtienen los datos de los archivos a subir
       $scope.userData = localStorageService.get('userData');
       formArchivos = document.getElementById("uploader");
       contentForm = (formArchivos.contentWindow || formArchivos.contentDocument);
       if (contentForm.document)
           btnSubmit = contentForm.document.getElementById("submit2");
       elements = contentForm.document.getElementById("uploadForm").elements;
       idTrabajoEdit = contentForm.document.getElementById("idTrabajo");
       idTipoEvidencia = contentForm.document.getElementById("idTipoEvidencia");
       idUsuario = contentForm.document.getElementById("idUsuario");
       vTrabajo = contentForm.document.getElementById("vTrabajo");
       idCategoria = contentForm.document.getElementById("idCategoria");
       idNombreEspecial = contentForm.document.getElementById("idNombreEspecial");
       idTrabajoEdit.value = $scope.idTrabajo;
       vTrabajo.value = "1";
       idTipoEvidencia.value = 1;
       idCategoria.value = 2;
       if($scope.hojaCalidad == 1)
        {
            idNombreEspecial.value = 2;
        } else{
            idNombreEspecial.value = 3;
        }         
       idUsuario.value = $scope.userData.idUsuario;
       //Submit del botón del Form para subir los archivos        
       btnSubmit.click();
       setTimeout(function(){
            archivoTrabajo($scope.idTrabajo, $scope.hojaCalidad);
        },2000);
   }
     
     //Carga Hoja de Calidad
    $scope.cargarArchivosHoja = function () {
       //Se obtienen los datos de los archivos a subir
       $scope.userData = localStorageService.get('userData');
       formArchivos = document.getElementById("uploader");
       contentForm = (formArchivos.contentWindow || formArchivos.contentDocument);
       if (contentForm.document)
           btnSubmit = contentForm.document.getElementById("submit2");
       elements = contentForm.document.getElementById("uploadForm").elements;
       idTrabajoEdit = contentForm.document.getElementById("idTrabajo");
       idTipoEvidencia = contentForm.document.getElementById("idTipoEvidencia");
       idUsuario = contentForm.document.getElementById("idUsuario");
       vTrabajo = contentForm.document.getElementById("vTrabajo");
       idCategoria = contentForm.document.getElementById("idCategoria");
       idNombreEspecial = contentForm.document.getElementById("idNombreEspecial");
       idTrabajoEdit.value = $scope.idTrabajo;
       vTrabajo.value = "1";
       idTipoEvidencia.value = 1;
       idCategoria.value = 2;
       idNombreEspecial.value = 2;
       idUsuario.value = $scope.userData.idUsuario;
       //Submit del botón del Form para subir los archivos        
       btnSubmit.click();
       setTimeout(function(){
            archivoTrabajo($scope.idTrabajo, $scope.hojaCalidad);
        },2000);
   }

    //cambia el trabajo a estatus a facturado
    var archivoTrabajo = function (idTrabajo, hojaCalidad) {
        if(hojaCalidad == 1){ 
            trabajoRepository.hojaCalidadTrabajo(idTrabajo).then(function (hojaCalidad) {
                if(hojaCalidad.data[0].idHistorialProceso){
                    alertFactory.success("Hoja de calidad cargada");
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                }
            }, function (error) {
                alertFactory.error("Error al cargar la hoja de calidad");
            });
        } 
        else{
            trabajoRepository.facturaTrabajo(idTrabajo).then(function (trabajoFacturado) {
                if(trabajoFacturado.data[0].idHistorialProceso){
                    alertFactory.success("Factura cargada");
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                }
            }, function (error) {
                alertFactory.error("Error al cargar la factura");
            });
        } 
    }
});
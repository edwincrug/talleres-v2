// -- =============================================
// -- Author:      Uriel Godínez Martínez
// -- Create date: 28/03/2016
// -- Description: Cotizacion Controller
// -- Modificó: Mario Mejía
// -- Fecha: 
// -- =============================================
registrationModule.controller('cotizacionController', function ($scope, $rootScope, alertFactory, localStorageService, cotizacionRepository, cotizacionMailRepository, exampleRepo) {
    $scope.arrayItem = [];
    $scope.arrayCambios = [];
    var valor = '';
    var id = 0;
    var idItem = 0;
    var existItem = null;
    var idCotizacion = 0;
    var obs = '';
    var ext = '';
    var type = '';
    var idTrabajo = 0;
    var idTaller = 0;
    var idUnidad = 0;
    var tipoEvidencia = 2; //Cotización
    $scope.editar = 0;
    $scope.total = 0;
    $scope.importe = 0;
    $scope.message = 'Buscando...';
    $scope.numEconomico = '';
    $scope.modeloMarca = '';
    $scope.trabajo = '';
    $scope.idCita = '';
    $scope.idTaller = '';
    $scope.userData = localStorageService.get('userData');

    var getExample = function(){
        exampleRepo.getEjemplo().then(function(exampleData){
            if(exampleData.data.length > 0){
                alertFactory.success("Éxito");
            }  
        });  
    }
    
    var getPieza = function(){
        exampleRepo.buscarPieza(1, 'espejo').then(function(pieza){
            if(pieza.data.length > 0){
                alertFactory.success("exito");   
            } 
        });
    }
    $scope.init = function () {
        // Collapse ibox function
        $('.collapse-link').click(function () {
            var ibox = $(this).closest('div.ibox');
            var button = $(this).find('i');
            var content = ibox.find('div.ibox-content');
            content.slideToggle(200);
            button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            ibox.toggleClass('').toggleClass('border-bottom');
            setTimeout(function () {
                ibox.resize();
                ibox.find('[id^=map-]').resize();
            }, 50);
        });
        exist = false;
        //Objeto de la pagina de tallerCita 
        if (localStorageService.get('cita') != null) {
            $scope.citaDatos = localStorageService.get('cita'); 
            $scope.estado = 1;
            $scope.editar = 0;
            datosCita();
            $scope.idTaller = $scope.citaDatos.idTaller;
            busquedaServicioDetalle($scope.citaDatos.idCita);
        }
        //Se valida si la cotización es para editar
        if (localStorageService.get('objEditCotizacion') != null) {
            $scope.editCotizacion = localStorageService.get('objEditCotizacion'); //objeto de la pagina autorizacion
            datosUnidad($scope.editCotizacion.idCotizacion,null);
            $scope.editar = 1;
            $scope.estado = 2;
            $scope.idTaller = $scope.editCotizacion.idTaller;
            $scope.editarCotizacion($scope.editCotizacion.idCotizacion,
                $scope.editCotizacion.idTaller);
        }
        //Objeto de la pagina de orden servicio
        if (localStorageService.get('orden') != null) { 
            $scope.orden = localStorageService.get('orden');
            $scope.estado = 3;
            $scope.idTaller = $scope.orden.idTaller;
            $scope.idTrabajo = $scope.orden.idTrabajo;
            datosUnidad(null,$scope.orden.idTrabajo);
        }
    }

    //Busqueda de item (servicio/pieza/refacción)
    $scope.buscarPieza = function (pieza) {
        if (pieza == '' || pieza == null) {
            alertFactory.info("Ingrese un dato para búsqueda");
        } else {
            $('.dataTableItem').DataTable().destroy();
            $('.dataTableCotizacion').DataTable().destroy();
            $scope.promise = cotizacionRepository.buscarPieza($scope.idTaller, pieza).then(function (result) {
                $scope.listaPiezas = result.data;
                if (result.data.length > 0) {
                    setTimeout(function () {
                        $('.dataTableItem').DataTable({
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
                    }, 2000);
                    alertFactory.success('Datos encontrados');
                } else {
                    alertFactory.info('No existe pieza con esa descripción');
                    $scope.listaPiezas = '';
                }
            }, function (error) {
                alertFactory.error('Error');
            });
        }
        pieza = '';
    }

    //Se agregan los items para el calculo de la cotización
    $scope.cotizacion = function (pieza) {
        if ($scope.arrayItem.length != 0) {
            if (existsItem(pieza) == true) {
                $scope.arrayItem.forEach(function (item, i) {
                    if (item.idItem == pieza.idItem && item.idTipoElemento == pieza.idTipoElemento) {
                        $scope.arrayItem[i].cantidad = item.cantidad + 1;
                        $scope.arrayItem[i].importe = ($scope.arrayItem[i].cantidad) * ($scope.arrayItem[i].precio)
                        //$scope.importe = $scope.arrayItem[i].importe;
                        $scope.sub = calcularSubtotal();
                        $scope.iva = calcularIva();
                        $scope.total = calculaTotal();
                    }
                });
                exist = false;
            } else {
                //Se agrega el item seleccionado al array
                $scope.arrayItem.push({
                    numeroPartida: pieza.numeroPartida,
                    idItem: pieza.idItem,
                    numeroParte: pieza.numeroParte,
                    item: pieza.item,
                    precio: pieza.precio,
                    cantidad: 1,
                    importe: pieza.precio * 1,
                    idTipoElemento: pieza.idTipoElemento,
                    valorIva: pieza.valorIva,
                    idEstatus: 8
                });
                $scope.sub = calcularSubtotal();
                $scope.iva = calcularIva();
                $scope.total = calculaTotal();
                exist = false;
            }
        } else {
            //Se agrega el item seleccionado al array
            $scope.arrayItem.push({
                numeroPartida: pieza.numeroPartida,
                idItem: pieza.idItem,
                numeroParte: pieza.numeroParte,
                item: pieza.item,
                precio: pieza.precio,
                cantidad: 1,
                importe: pieza.precio * 1,
                idTipoElemento: pieza.idTipoElemento,
                valorIva: pieza.valorIva,
                idEstatus: 8
            });
            $scope.sub = calcularSubtotal();
            $scope.iva = calcularIva();
            $scope.total = calculaTotal();
            exist = false;
        }
    };

    //Valida si el item ya existe en la cotización
    var existsItem = function (pieza) {
        $scope.arrayItem.forEach(function (item) {
            if (item.idItem == pieza.idItem && item.idTipoElemento == pieza.idTipoElemento)
                exist = true;
        });
        return exist;
    };

    //Calcula el total de la cotización
    var calculaTotal = function () {
        var total = 0;
        $scope.arrayItem.forEach(function (item) {
            total = total + (item.cantidad * parseFloat(item.precio)) + ((item.cantidad)*(parseFloat(item.precio) * parseFloat(item.valorIva / 100)));
        })
        return total;
    };

    //Calcula el total de la cotización en modo editar
    var calculaTotalEditar = function () {
        var total = 0;
        $scope.arrayItem.forEach(function (item) {
            total = total + (item.cantidad * parseFloat(item.precio)) + ((item.cantidad)*(parseFloat(item.precio) * parseFloat(item.valorIva / 100)))
        })
        return total;
    };

    //Calcula el importe de la cotización
    var calcularImporte = function () {
        var importe = 0;
        $scope.arrayItem.forEach(function (item) {
            item.importe = (item.cantidad * (parseFloat(item.precio) * parseFloat(item.valorIva / 100))) + parseFloat(item.precio)
        })
    }
    
    //Calcula el Subtotal
    var calcularSubtotal = function(){
        var sub = 0;
        $scope.arrayItem.forEach(function(item){
            sub = sub + (item.cantidad * parseFloat(item.precio));
        })
        return sub;
    }
    
    //Calcula el IVA
    var calcularIva = function(){
        var iva = 0;
        $scope.arrayItem.forEach(function(item){
            iva = iva + ((item.cantidad)*(parseFloat(item.precio) * parseFloat(item.valorIva / 100)));
        })
        return iva;
    }

    //Eliminar la pieza de la cotización
    $scope.quitarPieza = function (pieza) {
        $scope.arrayItem.forEach(function (item, i) {
            if (item.idItem == pieza.idItem && item.idTipoElemento == pieza.idTipoElemento) {
                if ($scope.arrayItem[i].cantidad > 1) {
                    $scope.arrayItem[i].cantidad = item.cantidad - 1;
                    $scope.arrayItem[i].importe = ($scope.arrayItem[i].cantidad) * ($scope.arrayItem[i].precio)
                    $scope.total = calculaTotal();
                    $scope.sub = calcularSubtotal();
                    $scope.iva = calcularIva();
                } else {
                    $scope.arrayItem.splice(i, 1);
                    $scope.total = calculaTotal();
                    $scope.sub = calcularSubtotal();
                    $scope.iva = calcularIva();
                    $scope.importe = 0;
                    if ($scope.editar == 1) {
                        $scope.arrayCambios[i].idEstatus = 13; //Estatus Eliminado
                    }
                }
            }
        })
    };

    //Envia la cotización para autorización
    $scope.enviarAutorizacion = function (observaciones) {
        if ($scope.arrayItem.length == 0) {
            alertFactory.info('Debe seleccionar items para la cotización');
        } else {
            if ($scope.objCita == null) {
                idUnidad = $scope.citaDatos.idUnidad;
            } else {
                idUnidad = $scope.objCita.idUnidad;
            }
        }
        cotizacionRepository.insertCotizacionMaestro($scope.citaDatos.idCita,
                $scope.userData.idUsuario,
                observaciones,
                idUnidad)
            .then(function (resultado) {
                alertFactory.success('Guardando Cotización Maestro');
                $scope.idCotizacion = resultado.data[0].idCotizacion;
                $scope.idTrabajo = resultado.data[0].idTrabajo;
                $scope.arrayItem.forEach(function (item, i) {
                    cotizacionRepository.insertCotizacionDetalle($scope.idCotizacion,
                            item.idTipoElemento,
                            item.idItem,
                            item.precio,
                            item.cantidad,
                            item.idEstatus)
                        .then(function (result) {
                            alertFactory.success('Guardando Cotización Detalle');
                        }, function (error) {
                            alertFactory.error('Error');
                        });
                });
                cotizacionMailRepository.postMail($scope.idCotizacion, $scope.citaDatos.idTaller, 1, '');
                localStorageService.remove('objCita');
                localStorageService.remove('cita');
                cargarArchivos($scope.idCotizacion, $scope.idTrabajo);
                location.href = '/cotizacionconsulta';
            }, function (error) {
                alertFactory.error('Error');
            });
    };

    //Termina de guardar la información de los archivos
    $scope.FinishSave = function () {
        alertFactory.success('Guardando Archivos');
        location.href = '/cotizacionconsulta';
    }

    //Carga los datos de la cotizacion a editar
    $scope.editarCotizacion = function (idCotizacion, idTaller) {
        cotizacionRepository.editarCotizacion($scope.editCotizacion.idCotizacion,
                $scope.editCotizacion.idTaller)
            .then(function (result) {
                $scope.arrayItem = result.data;
                if (result.data.length > 0) {
                    $scope.arrayCambios = $scope.arrayItem.slice();
                    $scope.observaciones = result.data[0].observaciones;
                    $scope.total = calculaTotalEditar();
                    //$scope.importe = calcularImporte();
                    $scope.sub = calcularSubtotal();
                    $scope.iva = calcularIva();
                    alertFactory.success('Datos Cargados');
                } else {
                    alertFactory.error('No hay datos para editar');
                }

            }, function (error) {
                alertFactory.error('Error');
            });
    }

    //Actualización de la cotización
    $scope.updateCotizacion = function (observaciones) {
        var formArchivos = '';
        var contentForm = '';
        var btnSubmit = '';
        var elements = '';
        eliminarElementos();
        $scope.arrayCambios.forEach(function (item, i) {
            cotizacionRepository.updateCotizacion($scope.editCotizacion.idCotizacion,
                    item.idTipoElemento,
                    item.idItem,
                    item.precio,
                    item.cantidad,
                    observaciones,
                    item.idEstatus)
                .then(function (result) {
                    alertFactory.success('Cotización Actualizada ');
                }, function (error) {
                    alertFactory.error('Error');
                });
        })
        $scope.arrayItem.forEach(function (item, i) {
            cotizacionRepository.updateCotizacion($scope.editCotizacion.idCotizacion,
                    item.idTipoElemento,
                    item.idItem,
                    item.precio,
                    item.cantidad,
                    observaciones,
                    item.idEstatus)
                .then(function (result) {
                    alertFactory.success('Cotización Actualizada ');
                }, function (error) {
                    alertFactory.error('Error');
                });
        })
        cotizacionMailRepository.postMail($scope.editCotizacion.idCotizacion, $scope.editCotizacion.idTaller, 1, '');
        localStorageService.remove('objEditCotizacion');
        localStorageService.remove('objFicha');
        cargarArchivos($scope.editCotizacion.idCotizacion, $scope.editCotizacion.idTrabajo);
        location.href = '/cotizacionconsulta';
    }

    //Se realiza la carga de archivos
    var cargarArchivos = function (idCotizacion, idTrabajo) {
            //Se obtienen los datos de los archivos a subir
            formArchivos = document.getElementById("uploader");
            contentForm = (formArchivos.contentWindow || formArchivos.contentDocument);
            if (contentForm.document)
                btnSubmit = contentForm.document.getElementById("submit2");
            elements = contentForm.document.getElementById("uploadForm").elements;
            idTrabajoEdit = contentForm.document.getElementById("idTrabajo");
            idCotizacionEdit = contentForm.document.getElementById("idCotizacion");
            idTipoEvidencia = contentForm.document.getElementById("idTipoEvidencia");
            idUsuario = contentForm.document.getElementById("idUsuario");
            idCategoria = contentForm.document.getElementById("idCategoria");
            idNombreEspecial = contentForm.document.getElementById("idNombreEspecial");
            idTrabajoEdit.value = idTrabajo;
            idCotizacionEdit.value = idCotizacion;
            idCategoria.value = 1;
            idNombreEspecial.value = 0;
            idTipoEvidencia.value = 2;
            idUsuario.value = $scope.userData.idUsuario;
            //Submit del botón del Form para subir los archivos        
            btnSubmit.click();
        }
        //Se obtienen datos de la unidad a editar
    var datosFicha = function () {
        if (localStorageService.get('objFicha') != null) {
            $scope.objFicha = localStorageService.get('objFicha');
            $scope.numEconomico = $scope.objFicha.numEconomico;
            $scope.modeloMarca = $scope.objFicha.marca + '  ' + $scope.objFicha.modelo;
            $scope.trabajo = $scope.objFicha.trabajo;
        }
    }

    //Se obtienen datos de la cita para generar la cotización
    var datosCita = function () {
        if (localStorageService.get('cita') != null) {
            $scope.numEconomico = $scope.citaDatos.numEconomico;
            $scope.modeloMarca = $scope.citaDatos.modeloMarca;
            $scope.trabajo = $scope.citaDatos.trabajo;
        }
    }

    //Cargar datos de la cotizacion desde la cita
    var busquedaServicioDetalle = function (idCita) {
        cotizacionRepository.busquedaServicioDetalle(idCita)
            .then(function (result) {
                $scope.arrayItem = result.data;
                $scope.arrayCambios = $scope.arrayItem.slice();
                //$scope.importe = calcularImporte();
                $scope.total = calculaTotalEditar();
                $scope.sub = calcularSubtotal();
                $scope.iva = calcularIva();
            }, function (error) {
                alertFactory.error('Error');
            });
    }

    //Envia la cotización para autorización
    $scope.enviarAutorizacionOrden = function (observaciones) {
        if ($scope.arrayItem.length == 0) {
            alertFactory.info('Debe seleccionar items para la cotización');
        }
        cotizacionRepository.insertCotizacionMaestro($scope.orden.idCita,
                $scope.orden.idUsuario,
                observaciones,
                $scope.orden.idUnidad)
            .then(function (resultado) {
                alertFactory.success('Guardando Cotización Maestro');
                $scope.idCotizacion = resultado.data[0].idCotizacion;
                $scope.idTrabajo = resultado.data[0].idTrabajo;
                $scope.arrayItem.forEach(function (item, i) {
                    cotizacionRepository.insertCotizacionDetalle($scope.idCotizacion,
                            item.idTipoElemento,
                            item.idItem,
                            item.precio,
                            item.cantidad,
                            item.idEstatus)
                        .then(function (result) {
                            alertFactory.success('Guardando Cotización Detalle');
                        }, function (error) {
                            alertFactory.error('Error');
                        });
                });
                cotizacionMailRepository.postMail($scope.idCotizacion, $scope.orden.idTaller, 1, '');
                localStorageService.remove('orden');
                cargarArchivos($scope.idCotizacion, $scope.idTrabajo);
                location.href = '/cotizacionconsulta';
            }, function (error) {
                alertFactory.error('Error');
            });
    };
    
    //Se obtienen los datos de la unidad a cotizar
    var datosUnidad = function(idCotizacion,idTrabajo){
        cotizacionRepository.datosUnidad(idCotizacion,idTrabajo)
            .then(function(result){
                $scope.numEconomico = result.data[0].numEconomico;
                $scope.modeloMarca = result.data[0].marca + ' ' + result.data[0].modeloMarca + ' ' + result.data[0].modelo;
                $scope.trabajo = result.data[0].trabajo;
        },function(error){
            alertFactory.error('Error');
        });
    }
    
    //Eliminar items que fueron quitados de la cotización
    var eliminarElementos = function(){
       $scope.arrayCambios.forEach(function (item, i) {
           if(item.idEstatus == 8){
               $scope.arrayCambios.splice(i, 1);
           }           
       })
    }
});
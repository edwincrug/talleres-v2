registrationModule.controller('cotizacionAutorizacionController', function ($scope, $rootScope, localStorageService, $location, alertFactory, cotizacionAutorizacionRepository, citaRepository, cotizacionRepository, cotizacionMailRepository, cotizacionConsultaRepository) {

    var cDetalles = [];
    var cPaquetes = [];
    var idCita = localStorageService.get('cita');
    var idCotizacion = localStorageService.get('cotizacion');
    var idTrabajo = localStorageService.get('work');
    var idTaller = localStorageService.get('taller');
    $scope.idTrabajoOrden = localStorageService.get('objTrabajo');
    $scope.estado = localStorageService.get('estado');
    $scope.setInterval = 5000;
    $scope.message = "Obteniendo información ...";
    $scope.chat = [];
    $scope.descripcion = localStorageService.get('desc');
    var tipoEvidencia = 2; //Cotización
    var idCotizacionEdita = 0;
    $scope.userData = localStorageService.get('userData');


    $scope.init = function () {
        $scope.cargaFicha();
        $scope.cargaChat();
        //$scope.getCotizacionByTrabajo();
        $scope.Detalle(idCotizacion, idTaller);
        //$scope.lookUpTrabajo(idCita);
        $scope.cargaEvidencias();
        //$scope.cargaDocs(idCotizacion);
        $scope.cargaDatosCliente(idCita);

        $rootScope.showChat = 1;
    }

    //Obtiene la conversación de la cita 
    $scope.cargaChat = function () {
        $scope.promise =
            cotizacionAutorizacionRepository.getChat(idCita).then(function (result) {
                if (result.data.length > 0) {
                    $scope.chat = result.data;
                }
            }, function (error) {
                alertFactory.error('No se pudo obtener la conversación del chat');
            });
    }

    //Obtiene la ficha técnica de la unidad
    $scope.cargaFicha = function () {
        cotizacionAutorizacionRepository.getFichaTecnica(idCita).then(function (result) {
            if (result.data.length > 0) {
                $scope.unidadInfo = result.data[0];
                localStorageService.set('objFicha', $scope.unidadInfo);
            } else {
                alertFactory.info('No se pudo obtener información de la unidad');
            }
        }, function (error) {
            alertFactory.error('No se pudo obtener información de la unidad');
        });
    }

    $scope.EnviarComentario = function (comentarios) {
        cotizacionAutorizacionRepository.putMessage(3, comentarios, idCita).then(function (result) {
                $scope.algo = result.data;
                $scope.cargaChat();
            },
            function (error) {});
    }

    $scope.getCotizacionByTrabajo = function () {
        $scope.promise =
            cotizacionAutorizacionRepository.getCotizacionByTrabajo(idCita).then(function (result) {
                    $scope.cotizacionesByTrabajo = result.data;
                },
                function (error) {});
    }

    //Autoriza una cotización
    $scope.Autorizar = function (comentario) {
        cotizacionAutorizacionRepository.putCotizacionAprobacion(idCotizacion, $scope.userData.idUsuario, comentario).then(function (result) {
            if (result.data.length > 0) {
                cotizacionMailRepository.postMail(idCotizacion, idTaller, 2, comentario);
                alertFactory.success('Cotización Autorizada correctamente');
                location.href = '/trabajo';
            } else {
                alertFactory.info('No se pudo autorizar la cotización');
            }
        }, function (error) {
            alertFactory.error('No se pudo autorizar la cotización, inténtelo más tarde');
        });
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

    //Obtiene las evidencias de una cotización
    $scope.cargaEvidencias = function () {
        cotizacionAutorizacionRepository.getEvidenciasByCotizacion(idCotizacion).then(function (result) {
            if (result.data.length > 0) {
                $scope.slides = result.data;
            }
        }, function (error) {
            alertFactory.error('No se puedieron obtener las evidencias de esta cotización');
        });
    }

    //Rechaza una cotización
    $scope.Rechazar = function (comentario) {
        cotizacionAutorizacionRepository.putCotizacionRechazo(idCotizacion, $scope.userData.idUsuario, comentario).then(function (result) {
            if (result.data.length > 0) {
                cotizacionMailRepository.postMail(idCotizacion, idTaller, 3, comentario);
                alertFactory.success('Cotización rechazada correctamente');
                location.href = '/trabajo';
            } else {
                alertFactory.info('No se pudo rechazar esta cotización');
            }
        }, function (error) {
            alertFactory.error('No se pudo rechazar esta cotización, inténtelo más tarde');
        });
    }

    $scope.nuevaCotizacion = function () {
        localStorageService.set('cita', localStorageService.get('objTrabajo'));
        location.href = '/cotizacionnueva';
    }

    $scope.Editar = function () {
        var objEditCotizacion = {
            idCotizacion: idCotizacion,
            idTaller: idTaller,
            idTrabajo: idTrabajo
        };

        if (localStorageService.get('cita') != null) {
            localStorageService.remove('cita');
        }
        if (localStorageService.get('orden') != null) {
            localStorageService.remove('orden');
        }
        localStorageService.set('objEditCotizacion', objEditCotizacion);
        location.href = '/cotizacionnueva';
    }

    //Se realiza la carga de archivos
    $scope.cargarArchivos = function () {
        //Se obtienen los datos de los archivos a subir
        formArchivos = document.getElementById("uploader");
        contentForm = (formArchivos.contentWindow || formArchivos.contentDocument);
        if (contentForm.document)
            btnSubmit = contentForm.document.getElementById("submit2");
        elements = contentForm.document.getElementById("uploadForm").elements;
        idTrabajoEdit = contentForm.document.getElementById("idTrabajo");
        idCotizacionEdit = contentForm.document.getElementById("idCotizacion");

        idTrabajoEdit.value = idTrabajo;
        idCotizacionEdit.value = idCotizacion;
        idCotizacionEdita = idCotizacion;

        for (var i = 0; i < elements.length; i++) {
            if (elements[i].value.lastIndexOf(".") > 0) {
                $scope.nombreArchivo = elements[i].value;
                $scope.tipoArchivo = obtenerExtArchivo($scope.nombreArchivo);
                $scope.idTipoArchivo = obtenerTipoArchivo($scope.tipoArchivo);
                cotizacionRepository.insertEvidencia(tipoEvidencia,
                        $scope.idTipoArchivo,
                        $scope.userData.idUsuario,
                        idCotizacionEdita,
                        $scope.nombreArchivo)
                    .then(function (result) {
                        alertFactory.success('Evidencia Guardada Correctamente');
                    }, function (error) {
                        alertFactory.error('Error');
                    });
            }
        }
        //Submit del botón del Form para subir los archivos        
        btnSubmit.click();
        $scope.cargaEvidencias();

        $scope.cargaDocs(idCotizacionEdita);
        $('#modal').modal('hide');
    }

    //Se obtiene la extensión del archivo
    var obtenerExtArchivo = function (file) {
        $scope.file = file;
        var res = $scope.file.substring($scope.file.length - 4, $scope.file.length)
        return res;
    }

    //Obtener el tipo de archivo
    var obtenerTipoArchivo = function (ext) {
        if (ext == '.pdf' || ext == '.doc' || ext == '.xls' || ext == '.docx' || ext == '.xlsx' ||
            ext == '.PDF' || ext == '.DOC' || ext == '.XLS' || ext == '.DOCX' || ext == '.XLSX' || ext == '.ppt' || ext == '.PPT') {
            type = 1;
        } else if (ext == '.jpg' || ext == '.png' || ext == '.gif' || ext == '.bmp' || ext == '.JPG' || ext == '.PNG' || ext == '.GIF' || ext == '.BMP') {
            type = 2;
        } else if (ext == '.mp4') {
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

    //Termina de guardar la información de los archivos
    $scope.FinishSave = function () {
        alertFactory.success('Guardando Archivos');
    }

    //Obtiene el detalle de la cotización y la muestra en pantalla
    $scope.Detalle = function (idCotizacion, idTaller) {
        $scope.sumaIvaTotal = 0;
        $scope.sumaPrecioTotal = 0;
        $scope.sumaGranTotal = 0;

        cotizacionConsultaRepository.getDetail(idCotizacion, idTaller).then(function (result) {
            if (result.data.length > 0) {
                $scope.total = 0;
                $scope.articulos = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    $scope.sumaIvaTotal += (result.data[i].cantidad * result.data[i].precio) * (result.data[i].valorIva / 100);

                    $scope.sumaPrecioTotal += (result.data[i].cantidad * result.data[i].precio);
                }
                $scope.sumaGranTotal = ($scope.sumaPrecioTotal + $scope.sumaIvaTotal);

                alertFactory.success('Detalle de la cotización, cargados.');
            } else {
                alertFactory.info('No se pudo obtener el detalle de esta cotización.');
            }
        }, function (error) {
            alertFactory.error('No se pudo obtener el detalle de esta cotización.');
        });

    }

    $scope.Evidencias = function () {
        location.href = '/cotizacionevidencias';
    }

    //Obtiene los datos del cliente
    $scope.cargaDatosCliente = function (idCita) {
        cotizacionAutorizacionRepository.getDatosCliente(idCita).then(function (result) {
            if (result.data.length > 0) {
                $scope.ClienteData = result.data[0];
            } else {
                alertFactory.info('No se pudo obtener los datos del cliente');
            }
        }, function (error) {
            alertFactory.error('No se pudo obtener los datos del cliente, inténtelo más tarde');
        });
    }

});
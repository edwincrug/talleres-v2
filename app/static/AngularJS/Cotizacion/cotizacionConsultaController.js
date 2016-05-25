// -- =============================================
// -- Author:      Uriel Godínez Martínez
// -- Create date: 28/03/2016
// -- Description: Cotizacion Controller
// -- Modificó: 
// -- Fecha: 
// -- =============================================
registrationModule.controller('cotizacionConsultaController', function ($scope, localStorageService, alertFactory, cotizacionConsultaRepository) {

    $scope.message = "Buscando...";

    $scope.init = function () {
        $scope.Maestro();
    }

    //Obtiene el detalle de una cotización
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

                $('#cotizacionDetalle').appendTo('body').modal('show');
                alertFactory.success('Datos cargados.');
            } else {
                alertFactory.info('No se pudo obtener el detalle de esta cotización.');
            }
        }, function (error) {
            alertFactory.info('No se pudo obtener el detalle de esta cotización.');
        });

    }

    //Obtiene las cotizaciones pendientes por autorizar
    $scope.Maestro = function () {
        $scope.promise =
            cotizacionConsultaRepository.get().then(function (result) {
                    if (result.data.length > 0) {
                        $scope.cotizaciones = result.data;
                        setTimeout(function () {
                            $('.dataTableCotizaciones').DataTable({
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
                        }, 1000);
                    } else {
                        alertFactory.info('No se encontraron cotizaciones.');
                    }
                },
                function (error) {
                    alertFactory.error('No se encontraron cotizaciones, inténtelo más tarde.');
                });
    }

    //Redirige los parametros de la cotización para su aprobación
    $scope.Autorizacion = function (idCita1, idCotizacion1, idUnidad1, numeroCotizacion, idTrabajo1, taller1) {
        localStorageService.set('cita', idCita1);
        localStorageService.set('cotizacion', idCotizacion1);
        localStorageService.set('unidad', idUnidad1);
        localStorageService.set('estado', 1);
        localStorageService.set('desc', numeroCotizacion)
        localStorageService.set('work', idTrabajo1);
        localStorageService.set('taller', taller1);
        localStorageService.set('citaMsg', idCita1);
        location.href = '/cotizacionautorizacion';
    }

    $scope.Nueva = function () {
        location.href = "/cotizacionnueva";
    }

});
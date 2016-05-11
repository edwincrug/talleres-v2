// -- =============================================
// -- Author:      Mario Mejía
// -- Create date: 23/03/2016
// -- Description: trabajo controller
// -- Modificó: Vladimir Juárez Juárez
// -- Fecha: 10/04/2016
// -- =============================================
registrationModule.controller('trabajoController', function($scope, localStorageService, alertFactory, trabajoRepository){
	//this is the first method executed in the view
	$scope.init = function(){
		getTrabajo();
	}

	var getTrabajo = function(){
		trabajoRepository.getTrabajo().then(function(trabajo){
            $('.dataTableTrabajo').DataTable().destroy();
			$scope.trabajos = trabajo.data;
			if(trabajo.data.length > 0){
                waitDrawDocument("dataTableTrabajo");
				alertFactory.success("Trabajos cargados");
			}
			else{
				alertFactory.info("No se encontraron trabajo");
			}
		}, function(error){
			alertFactory.error("Error al cargar trabajos");
		});
	}
	
	$scope.aprobacion = function(trabajo){
		localStorageService.set('cita', trabajo.idCita);
    	localStorageService.set('cotizacion', trabajo.idCotizacion);
    	localStorageService.set('estado', 2);
    	localStorageService.set('objTrabajo', trabajo);
		location.href = '/cotizacionTrabajo';
	}
    
    //espera que el documento se pinte para llenar el dataTable
    var waitDrawDocument = function(dataTable){
        setTimeout(function(){
            $('.'+dataTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [
                    { extend: 'copy'},
                    {extend: 'csv'},
                    {extend: 'excel', title: 'ExampleFile'},
                    {extend: 'pdf', title: 'ExampleFile'},

                    {extend: 'print',
                     customize: function (win){
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
    
    //abre el modal para la finalización del trabajo
    $scope.openFinishingTrabajoModal = function(){
		$('#finalizarTrabajoModal').appendTo("body").modal('show');
    }
});
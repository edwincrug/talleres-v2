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
        getTrabajoTerminado();
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
				alertFactory.info("No se encontraron trabajos");
			}
		}, function(error){
			alertFactory.error("Error al cargar trabajos");
		});
	}
    
    //obtiene los trabajos terminados
    var getTrabajoTerminado = function(){
        $('.dataTableTrabajoTerminado').DataTable().destroy();
        trabajoRepository.getTrabajoTerminado().then(function(trabajoTerminado){
            $scope.trabajosTerminados = trabajoTerminado.data;
            
            if(trabajoTerminado.data.length){
                waitDrawDocument("dataTableTrabajoTerminado");
				alertFactory.success("Trabajos cargados");
            }
            else{
                alertFactory.info("No se encontraron trabajos");
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
    
    //actualiza el trabajo a estatus terminado
    $scope.updTerminaTrabajo = function(observacion){
        trabajoRepository.terminaTrabajo($scope.idTrabajo,observacion).then(function(trabajoTerminado){
            if(trabajoTerminado.data[0].idHistorialProceso != 0){
                getTrabajo();
                getTrabajoTerminado();
                controlTabs();
                $('#finalizarTrabajoModal').modal('hide');
            }
        });
    }
    
    //abre el modal para la finalización del trabajo
    $scope.openFinishingTrabajoModal = function(idTrabajo){
		$('#finalizarTrabajoModal').appendTo("body").modal('show');
        $scope.idTrabajo = idTrabajo;
    }
    
    var controlTabs = function () {
      $scope.tabs = {tab1: false, tab2: true}; 
    }; 
    
    $scope.click = function(){
        $('.demo3').click(function () {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButstonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                swal("Deleted!", "Your imaginary file has been deleted.", "success");
            });
        });
    }

        /*$('.demo4').click(function () {
            swal({
                        title: "Are you sure?",
                        text: "Your will not be able to recover this imaginary file!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        cancelButtonText: "No, cancel plx!",
                        closeOnConfirm: false,
                        closeOnCancel: false },
                    function (isConfirm) {
                        if (isConfirm) {
                            swal("Deleted!", "Your imaginary file has been deleted.", "success");
                        } else {
                            swal("Cancelled", "Your imaginary file is safe :)", "error");
                        }
                    });
        });*/
});
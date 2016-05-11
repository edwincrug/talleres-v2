// -- =============================================
// -- Author:      Uriel Godínez Martínez
// -- Create date: 23/03/2016
// -- Description: Citas controller
// -- Modificó: V. Vladimir Juárez Juárez
// -- Fecha: 30/03/2016
// -- =============================================
registrationModule.controller('citaController', function($scope, $route,$rootScope, localStorageService, alertFactory,citaRepository, cotizacionRepository){
	$scope.message = 'Buscando...';

	$scope.init = function(){
		$scope.habilitaBtnBuscar = true;
	}

	//init de la pantalla citaTrabajo
	$scope.initCita = function(){
		$scope.unidadInfo = localStorageService.get('unidad');
		getCita($scope.unidadInfo.idUnidad);
	}

	//init de la pantalla  nuevaCita
	$scope.initNuevaCita = function(){
        $('.clockpicker').clockpicker();
        // When the window has finished loading google map
        google.maps.event.addDomListener(window, 'load', init);

        function init() {
            // Options for Google map
            // More info see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
            var mapOptions1 = {
                zoom: 11,
                center: new google.maps.LatLng(19.3329031, -99.2031112),
                // Style for Google Maps
                styles: [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}]
            };

            // Get all html elements for map
            var mapElement1 = document.getElementById('map1');
            // Create the Google Map using elements
            var map1 = new google.maps.Map(mapElement1, mapOptions1);
        }
		$scope.selectedTaller = true;
		$scope.datosCita = {};
		$scope.unidadInfo = localStorageService.get('unidad');
		$scope.labelItems = 0;
	}

	//init de la pantalla tallerCita
	$scope.initTallerCita = function(){
        $('#calendar .input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: true,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            todayHighlight: true
        });
		if($route.current.params.confCita != undefined){
			var idConfCita = Number($route.current.params.confCita);
			var fecha = $route.current.params.fecha;
			if(idConfCita != 0){
				citaRepository.validaConfirmacionCita(idConfCita).then(function(exists){
					if(exists.data[0].confirmada == 1){
						alertFactory.success("La cita ya ha sido confirmada");
						getCitaTaller(fecha, idConfCita);
					}
					else{
						confirmarCita(idConfCita);
						getCitaTaller(fecha, idConfCita);
					}
				});
			}
		}
		else{
			var date = new Date();
            $scope.fecha = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
			$scope.busquedaCita($scope.fecha);
		}
	}

	//obtiene la unidad mediante el dato buscado
	var getUnidad = function(datoUnidad){
		$('#btnBuscar').button('Buscando...');
		$scope.promise = citaRepository.getUnidadInformation(datoUnidad).then(function(unidadInfo){
			$scope.unidades = unidadInfo.data;
			if(unidadInfo.data.length > 0){
                waitDrawDocument("dataTableUnidad");
				alertFactory.success('Datos encontrados');
				$('#btnBuscar').button('reset');
			}
			else{
				alertFactory.info('No se encontraron datos');
				$('#btnBuscar').button('reset');
			}
		}, function(error){
			alertFactory.error('Error al obtener los datos');
			$('#btnBuscar').button('reset');
		});
	}

	//obtiene las citas de la unidad
	var getCita = function(idUnidad){
		$scope.promise = citaRepository.getCita(idUnidad).then(function(cita){
			$scope.citas = cita.data;
			if(cita.data.length > 0){
                waitDrawDocument("dataTableCita");
				alertFactory.success('Datos encontrados');
			}
			else{
				alertFactory.info('No se encontraron datos');
			}
		}, function(error){
			alertFactory.error('Error al obtener datos');
		});
	}

	//regresa a la pantalla de cita
	$scope.backToCita = function(){
		location.href = '/cita';
	}

	//Obtiene información de la unidad
	$scope.lookUpUnidad = function(datoUnidad){
		if(datoUnidad !== '' && datoUnidad !== undefined){
			getUnidad(datoUnidad);
		}
		else{
			alertFactory.info('Llene el campo de búsqueda');
		}		
	} 

	//obtiene las citas y servicios de la unidad
	$scope.lookUpCita = function(unidad){
		location.href = '/citatrabajo';
		localStorageService.set('unidad', unidad);
	}

	$scope.busquedaCita = function(fecha){
        var date = fecha.toString();
        var dia = date.substring(0,2);
        var mes = date.substring(3,5);
        var anio = date.substring(6,date.length);
		var date = anio +''+ mes +''+ dia;
		getCitaTaller(date, 0);
	}

	var getCitaTaller = function(fecha, idCita){
		$scope.promise = citaRepository.getCitaTaller(fecha, idCita).then(function(cita){
			if(cita.data.length > 0){
				$scope.listaCitas = cita.data;
                waitDrawDocument("dataTableCitaTaller");   
				alertFactory.success('Datos de citas cargados.');
			}			
			else{		
				$scope.listaCitas = '';
	    		alertFactory.info('No hay citas en la fecha seleccionada.');
			}	
		},function(error){
			alertFactory.error("Error al obtener citas");
		});	
	}
	//realiza el cambio de estatus de la cita en CONFIRMADA
	var confirmarCita = function(confCita){
		citaRepository.confirmarCita(confCita).then(function(citaConfirmada){
			if(citaConfirmada.data.length > 0){
				alertFactory.success("Cita confirmada");
			}	
			else{
				alertFactory.info("No se encontró la cita");
			}
		},function(error){
			alertFactory.error("Error al confirmar la cita");
		});
	}

    //obtiene los talleres con su especialidad
    $scope.lookUpTaller = function(datoTaller){
    	if(datoTaller !== '' && datoTaller !== undefined){
			$scope.promise = citaRepository.getTaller(datoTaller).then(function(taller){
	    		$scope.talleres = taller.data;
	    		if(taller.data.length > 0){
                    waitDrawDocument("dataTableTaller");
	    			alertFactory.success('Datos encontrados');
	    		}
	    		else{
	    			alertFactory.info('No se encontraron datos');
	    		}
	    	},function(error){
	    		alertFactory.error('Error al obtener los datos');
	    	});
    	}
    	else{
    		alertFactory.info('Llene el campo de búsqueda');
    	}
    	inicializaListas();
    }

    //inserta una nueva cita
    $scope.addCita = function(){
  		
    	if($scope.datosCita.fechaCita !== undefined && $scope.datosCita.horaCita !== undefined && $scope.datosCita.trabajoCita !== undefined && $scope.datosCita.idTaller != undefined){
    		$scope.datosCita.pieza = "";
    		if(localStorageService.get('stgListaPiezas', $scope.listaPiezas) != undefined){
    			$scope.datosCita.pieza = localStorageService.get('stgListaPiezas', $scope.listaPiezas).slice(0);
    		}
    		var citaTaller = {};
    		citaTaller.idCita = 0;
			citaTaller.idUnidad = localStorageService.get('unidad').idUnidad;
			citaTaller.idTaller = $scope.datosCita.idTaller;
			citaTaller.fecha = $scope.datosCita.fechaCita+' '+$scope.datosCita.horaCita;
			citaTaller.trabajo = $scope.datosCita.trabajoCita;
			citaTaller.observacion = $scope.datosCita.observacionCita;
			citaTaller.idUsuario = 2;
			
			citaRepository.addCita(citaTaller).then(function(cita){
				citaTaller.idCita = cita.data[0].idCita;

				if($scope.datosCita.pieza != ""){
					$scope.datosCita.pieza.forEach(function(pieza, i){
						var item = {};
						item.idCita = citaTaller.idCita;
						item.idTipoElemento = pieza.idTipoElemento;
						item.idElemento = pieza.idItem;
						item.cantidad = pieza.cantidad;
						citaRepository.addCitaServicioDetalle(item).then(function(piezaInserted){
							if(piezaInserted.data.length > 0){
								alertFactory.success("Se insertó correctamente");
							}
						},function(error){
							alertFactory.error("Error al insertar servicios");
						});
					});
				}
				
				alertFactory.success("Se agendó correctamente");
				$scope.clearInputs();
				//envío de correo electrónico
				citaRepository.enviarMailConfirmacion(citaTaller.idCita).then(function(enviado){
					if(enviado.data.length > 0){
						alertFactory.success("e-mail enviado");
					}
					else{
						alertFactory.info("No se envío el e-mail");
					}
				},function(error){
						alertFactory.error("Error al enviar el e-mail")
				});
				location.href = '/tallerCita';
				localStorageService.set('objCita', citaTaller);
				localStorageService.remove('stgListaPiezas');
			},function(error){
				alertFactory.error("Error al insertar la cita");
			});
    	}
    	else{
    		alertFactory.info("Llene todos los campos");
    	}
    }

    //combina la fecha y hora en una cadena
    var combineDateAndTime = function(date, time){
	    timeString = time.getHours() + ':' + time.getMinutes() + ':00';

	    var year = date.getFullYear();
	    var month = date.getMonth() + 1; // Jan is 0, dec is 11
	    var day = date.getDate();
	    var dateString = '' + year + '-' + month + '-' + day;
	    var combined = dateString+' '+timeString;

	    return combined;
	};

	//limpia los inputs del modal Cita
	$scope.clearInputs = function(){
		$scope.talleres = [];
		$scope.datoTaller = undefined;
		$scope.fechaCita = undefined;
		$scope.horaCita = undefined;
		$scope.trabajoCita = undefined;
	}

	//obtiene el taller seleccionado
	$scope.getTaller = function(idTaller){
		$scope.listaPiezas = [];
    	$scope.piezas = [];
    	$scope.datosCita.pieza = "";
		$scope.selectedTaller = false;
		$scope.datosCita.idTaller = idTaller;
	}

	//Redirige a pagina para nueva cotización
	$scope.nuevaCotizacion = function(cita){
		localStorageService.set('cita', cita);
        location.href = '/cotizacionNueva';
	}

	//despliega el div de las tablas
	$scope.slideDown = function()
	{
	    $("#borderTop").slideDown(2000);
	}

	//contrae el div de las tablas
	$scope.slideUp = function(){
		$("#borderTop").slideUp(3000);
	}

	//habilita el botón de buscar
	$scope.habilitaBuscar = function(datoUnidad){
		if(datoUnidad.length >=4){
			$scope.habilitaBtnBuscar = false;
		}else{
			$scope.habilitaBtnBuscar = true;
		}
	}

	//va a la pantalla de nueva cita
	$scope.goNewCita = function(){
		location.href = 'nuevacita';
	}

	//visualiza la modal de servicioCita
	$scope.showCitaServicioModal = function(){
		$scope.piezas = [];
		$scope.pieza = "";
		$('#citaServicioModal').appendTo("body").modal('show');
	}

	//init de servicio controller
	$scope.initCitaServicio = function(){
		$scope.listaPiezas = [];
	}

	//obtiene servicios/items
	$scope.getPieza = function(nombrePieza){
		if(nombrePieza !== '' && nombrePieza !== undefined){
			$('#btnBuscarPieza').button('Buscando...');
			$scope.promise = cotizacionRepository.buscarPieza($scope.datosCita.idTaller, nombrePieza).then(function(pieza){
				$scope.piezas = pieza.data;
				if(pieza.data.length > 0){
					alertFactory.success("Datos obtenidos");
				}
				else{
					$scope.piezas = [];
					alertFactory.info("No se encontraron piezas");
				}
			}, function(error){
				alertFactory.error("Error al obtener piezas");
				$('#btnBuscarPieza').button('reset');
			});
		}
		else{
			$scope.piezas = [];
			alertFactory.info("Introduzca datos para buscar")
		}
		$('#btnBuscarPieza').button('reset');
	}

	//añade una pieza en la lista
	$scope.addPieza = function(pieza){
		if($scope.listaPiezas.length > 0){ //idItem
			if(validaItemExists($scope.listaPiezas, pieza.idItem) == false){
				pieza.cantidad = 1;
				$scope.listaPiezas.push(pieza);
				$scope.labelItems = $scope.listaPiezas.length;
			}
		}
		else{
				pieza.cantidad = 1;
				$scope.listaPiezas.push(pieza);
				$scope.labelItems = $scope.listaPiezas.length;
		}
	}

	//valida si ya existe la pieza y aumenta la cantidad
	var validaItemExists = function(piezas, idItem){
		var exists = false;
		piezas.forEach(function(p, i){
			if(p.idItem == idItem){
				$scope.listaPiezas[i].cantidad =  p.cantidad + 1;
				exists = true;
			}
		});
		return exists;
	}

	//quita piezas de la lista
	$scope.removePieza = function(idItem){
		$scope.listaPiezas.forEach(function(p, i){
			if(p.idItem == idItem){
				if(p.cantidad > 1){
					$scope.listaPiezas[i].cantidad =  p.cantidad - 1;
				}
				else{
					$scope.listaPiezas.splice(i,1);
					$scope.labelItems = $scope.listaPiezas.length;	
				}
			}	
		})
	}

	//regresar a nueva cita
	$scope.generarCitaServicio = function(){
		$('#citaServicioModal').modal('hide');
		localStorageService.set('stgListaPiezas', $scope.listaPiezas);
	}

	//inicializa valores
	var inicializaListas = function(){
		$scope.talleres = [];
    	$scope.listaPiezas = [];
    	$scope.piezas = [];
    	$scope.datosCita.idTaller = undefined;
	}

	//muestra la pantalla de linea de tiempo
	$scope.goToLineTime = function(idCita){
		location.href = '/lineatiempo';
		localStorageService.set('hIdCita', idCita);
	}

	//init de linea de tiempo
	$scope.initLineTime = function(){
		var idCita =  localStorageService.get('hIdCita');
		if(idCita != undefined){
			getHistorialUnidad(idCita);
		}
		//remueve la variable localStorage hIdCita
		//localStorageService.remove('hIdCita');
	}
	//muestra el historial de la unidad (cita/trabajo y cotizaciones)
	var getHistorialUnidad = function(idCita){
		citaRepository.getHistorialCita(idCita).then(function(hCita){
			$scope.historialCita = hCita.data;
			if(hCita.data.length > 0){
				citaRepository.getHistorialTrabajo($scope.historialCita[0].idTrabajo).then(function(hTrabajo){
					$scope.historialTrabajo = hTrabajo.data;
					if(hTrabajo.data.length > 0){
						citaRepository.getHistorialCotizacion($scope.historialTrabajo[0].idTrabajo).then(function(hCotizacion){
							$scope.historialCotizacion = hCotizacion.data;
						})
					}
				})
			}
			else{
				alertFactory.info("No hay historial cita");
			}
		}, function(error){
			alertFactory.error("Error al obtener historial cita");
		})
	}
    
    //ir a cotización trabajo
    $scope.goToCotizacionTrabajo = function(cita){
        //obtiene los tabajos de la cita
        $scope.promise = citaRepository.getTrabajo(cita.idCita).then(function(trabajo){
			if(trabajo.data.length > 0){
				location.href = '/cotizacionTrabajo'
                localStorageService.set("objTrabajo", trabajo.data);
			}
			else{
				alertFactory.info('Aún no existe un trabajo');
			}

		}, function(error){
			alertFactory.error("Error al obtener datos del trabajo");
		})
    }
    
    //fecha
    $('#fechaTrabajo .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: true,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });
    
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
    
});
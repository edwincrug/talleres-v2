// -- =============================================
// -- Author:      Uriel Godínez Martínez
// -- Create date: 23/03/2016
// -- Description: Citas controller
// -- Modificó: V. Vladimir Juárez Juárez
// -- Fecha: 30/03/2016
// -- =============================================
registrationModule.controller('citaController', function($scope, $route,$rootScope, localStorageService, alertFactory,citaRepository, cotizacionRepository){
	var cDetalles = [];
	var cPaquetes = [];
	$scope.message = 'Buscando...';

	$scope.init = function(){
        $scope.unidades = [];
		$scope.idTaller = 0;
		$scope.habilitaBtnBuscar = true;
	}

	//init de la pantalla citaTrabajo
	$scope.initCita = function(){
		$scope.unidadInfo = localStorageService.get('unidad');
		getCita($scope.unidadInfo.idUnidad);
	}

	//init de la pantalla  nuevaCita
	$scope.initNuevaCita = function(){
		$scope.selectedTaller = true;
		$scope.datosCita = {};
		$scope.unidadInfo = localStorageService.get('unidad');
		$scope.labelItems = 0;
	}

	//init de la pantalla tallerCita
	$scope.initTallerCita = function(){
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
			$scope.fecha = new Date();
			$scope.busquedaCita($scope.fecha);
		}
	}

	//obtiene la unidad mediante el dato buscado
	var getUnidad = function(datoUnidad){
		$('#btnBuscar').button('Buscando...');
		$scope.promise = citaRepository.getUnidadInformation(datoUnidad).then(function(unidadInfo){
			$scope.unidades = unidadInfo.data;
			if(unidadInfo.data.length > 0){
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
		//obtiene todas las citas de la unidad
		$scope.promise = citaRepository.getCita(idUnidad).then(function(cita){
			$scope.citas = cita.data;
			if(cita.data.length > 0){
				alertFactory.success('Datos encontrados');
			}
			else{
				alertFactory.info('No se encontraron datos');
			}
		}, function(error){
			alertFactory.error('Error al obtener datos');
		});
	}

	//obtiene los tabajos de la cita
	$scope.lookUpTrabajo = function(cita){
		$scope.promise = citaRepository.getTrabajo(cita.idCita).then(function(trabajo){
			if(trabajo.data.length > 0){
				$scope.slideDown();
				$scope.cita = cita;
				alertFactory.success('Trabajo cargado');
				//obtiene las cotizaciones(servicios) de la unidad
				$scope.promise = citaRepository.getCotizacion(trabajo.data[0].idTrabajo).then(function(cotizacion){
					if(cotizacion.data.length > 0){
						citaRepository.getCotizacionDetalle(trabajo.data[0].idTrabajo).then(function(cotizacionDetalle){
							citaRepository.getPaquete(trabajo.data[0].idTrabajo).then(function(cotPaquete){
								getCotizacionDetallePaquete(trabajo.data, cotizacion.data, cotizacionDetalle.data, cotPaquete.data);
							});
						});
					}
					else{
						alertFactory.info('No se encontraron cotizaciones');
					}
				}, function(error){
					alertFactory('Error al obtener las cotizaciones');
				});
			}
			else{
				alertFactory.info('No se encontraron datos del trabajo');
				$scope.trabajo = [];
				$scope.cita = [];
			}

		}, function(error){
			alertFactory.error("Error al obtener datos del trabajo");
		})
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

	//Obtiene la lista de trabajo/cotizaciones/detalle/paquete por unidad
	var getCotizacionDetallePaquete = function(trabajo, cotizacion, cotizacionDetalle, paquetes){
		$scope.trabajo = [];

		//crea una propiedad trabajo y agrega los objetos en el array
		trabajo.forEach(function(t){
			$scope.trabajo.push({trabajo: t});
			$scope.trabajo[0].trabajo.cotizacion = cotizacion;
			$scope.trabajo[0].trabajo.cotizacion.forEach(function(c, i){

				//consulta de cotizaciones detalle
				cDetalles = Enumerable.From(cotizacionDetalle)
				.Where(function(x){return x.idCotizacion == c.idCotizacion})
				.Select(function(x){return x})
				.ToArray();
				//añade detalles por cotización
				$scope.trabajo[0].trabajo.cotizacion[i].cotizacionDetalle = cDetalles;

				$scope.trabajo[0].trabajo.cotizacion[i].cotizacionDetalle.forEach(function(cd, j){
					//consulta de paquetes de cotización detalle
					cPaquetes = Enumerable.From(paquetes)
					.Where(function(x){return x.idCotizacion == c.idCotizacion && cd.idTipoElemento == 1})
					.Select(function(x){return x})
					.ToArray();
					if(cPaquetes.length > 0){
						$scope.trabajo[0].trabajo.cotizacion[i].cotizacionDetalle[j].paquete = cPaquetes;
					}
				});
			});
		});
	}

	//obtiene las citas y servicios de la unidad
	$scope.lookUpCita = function(unidad){
		location.href = '/citatrabajo';
		localStorageService.set('unidad', unidad);
	}

	//expande y contrae las filas de las tablas
	$(function(){
		$('body').on('click', '.CX button', function(){
			if($(this).text() == '+'){
				$(this).text('-');
			}
			else{
				$(this).text('+');
			}
			$(this).closest('tr')
			.next('tr')
			.toggle();
		});
	});

	$scope.busquedaCita = function(fecha){
		var dia = fecha.getDate();
		if(dia < 9){
			dia = ''+'0'+dia 
		}
		var mes = fecha.getMonth()+1;
		if(mes < 9){
			mes = ''+'0'+mes 
		}
		var anio = fecha.getFullYear();
		var date = anio +''+ mes +''+ dia;
					
		getCitaTaller(date, 0);
	}

	var getCitaTaller = function(fecha, idCita){
		$scope.promise = citaRepository.getCitaTaller(fecha, idCita).then(function(cita){
			if(cita.data.length > 0){
				$scope.listaCitas = cita.data;
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
			citaTaller.idTaller = $scope.datosCita.idTaller;//$scope.idTaller;
			citaTaller.fecha = combineDateAndTime($scope.datosCita.fechaCita, $scope.datosCita.horaCita);
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
		location.href = '/nuevacita';
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

});
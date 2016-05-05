// -- =============================================
// -- Author:      Vladimi Juárez Juárez
// -- Create date: 23/03/2016
// -- Description: Citas controller
// -- Modificó: V. Vladimir Juárez Juárez
// -- Fecha: 22/04/2016
// -- =============================================
registrationModule.controller('servicioController', function($scope, $rootScope, localStorageService, alertFactory, cotizacionRepository){
	$scope.message = 'Buscando...';
	$scope.listaPiezas = [];

	//init de servicio controller
	$scope.init = function(){
		
	}

	//obtiene servicios/items
	$scope.getPieza = function(nombrePieza){
		if(nombrePieza !== '' && nombrePieza !== undefined){
			$('#btnBuscarPieza').button('Buscando...');
			var idTaller = localStorageService.get('idTaller');
			$scope.promise = cotizacionRepository.buscarPieza(idTaller, nombrePieza).then(function(pieza){
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
			}
		}
		else{
				pieza.cantidad = 1;
				$scope.listaPiezas.push(pieza);
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
				}
			}	
		})
	}

	//regresar a cita cotización
});

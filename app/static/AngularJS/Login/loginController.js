registrationModule.controller('loginController', function($scope, $rootScope){
	var vuser = 'admin'
	var vpassword = '12345admin';
	$rootScope.sesion = 0;

	$scope.init = function(){

	}

	$scope.login = function(user, password){
		if(vuser == user &&  vpassword == password)
		{
			location.href = '/cita';
			$rootScope.sesion = 1;
		}
	}
});
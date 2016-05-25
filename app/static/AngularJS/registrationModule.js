// -- =============================================
// -- Author:      Vladimir Juárez
// -- Create date: 18/03/2016
// -- Description: Is the container of the application
// -- Modificó: 
// -- Fecha: 
// -- =============================================
var registrationModule = angular.module("registrationModule", ["ngRoute", "LocalStorageModule",
        "ui.bootstrap", "angularUtils.directives.dirPagination", "cgBusy"])
    .config(function ($routeProvider, $locationProvider) {

        /*change the routes*/
        $routeProvider.when('/', {
            templateUrl: 'AngularJS/Templates/login.html',
            controller: 'loginController'
        });

        $routeProvider.when('/cita', {
            templateUrl: 'AngularJS/Templates/cita.html',
            controller: 'citaController'
        });

        $routeProvider.when('/citatrabajo', {
            templateUrl: 'AngularJS/Templates/citatrabajo.html',
            controller: 'citaController'
        });

        $routeProvider.when('/nuevacita', {
            templateUrl: 'AngularJS/Templates/nuevaCita.html',
            controller: 'citaController'
        });

        $routeProvider.when('/citaservicio', {
            templateUrl: 'AngularJS/Templates/citaServicio.html',
            controller: 'servicioController'
        });

        $routeProvider.when('/tallercita', {
            templateUrl: 'AngularJS/Templates/tallerCita.html',
            controller: 'citaController'
        });

        $routeProvider.when('/cotizacionnueva', {
            templateUrl: 'AngularJS/Templates/cotizacionNueva.html',
            controller: 'cotizacionController'
        });

        $routeProvider.when('/cotizacionconsulta', {
            templateUrl: 'AngularJS/Templates/cotizacionConsulta.html',
            controller: 'cotizacionConsultaController'
        });

        $routeProvider.when('/cotizacionautorizacion', {
            templateUrl: 'AngularJS/Templates/cotizacionAutorizacion.html',
            controller: 'cotizacionAutorizacionController'
        });

        $routeProvider.when('/trabajo', {
            templateUrl: 'AngularJS/Templates/trabajo.html',
            controller: 'trabajoController'
        });

        $routeProvider.when('/lineatiempo', {
            templateUrl: 'AngularJS/Templates/lineaTiempo.html',
            controller: 'citaController'
        });

        $routeProvider.when('/ordenservicio', {
            templateUrl: 'AngularJS/Templates/ordenservicio.html',
            controller: 'ordenServicioController'
        });

        $routeProvider.when('/cotizacionevidencias', {
            templateUrl: 'AngularJS/Templates/cotizacionEvidencias.html',
            controller: 'cotizacionEvidenciasController'
        });

        $routeProvider.when('/ordenservicioevidencias', {
            templateUrl: 'AngularJS/Templates/ordenservicioevidencias.html',
            controller: 'ordenServicioEvidenciaController'
        });

        $routeProvider.when('/ordenesporcobrar', {
            templateUrl: 'AngularJS/Templates/ordenesporcobrar.html',
            controller: 'ordenPorCobrarController'
        });


        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

registrationModule.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        var changeHeight = function () {
            element.css('height', (w.height() - 20) + 'px');
        };
        w.bind('resize', function () {
            changeHeight(); // when window size gets changed          	 
        });
        changeHeight(); // when page loads          
    }
});
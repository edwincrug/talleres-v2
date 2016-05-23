var searchUrl2 = global_settings.urlCORS + '/api/example/';
//var ruta = 'C:/Users/Mario/Documents/FileUpload';

registrationModule.factory('exampleRepo', function ($http) {
    return {
        getEjemplo: function(){
            return $http({
                url: searchUrl2 + 'gejemplo/',
                method: "GET"
            });
        },
        buscarPieza: function(idTaller,nombrePieza){
            var msgObj = {
                idTaller: idTaller,
                nombrePieza: nombrePieza
            }
            return $http({
                url: searchUrl2 + 'buscarPieza',
                method: "POST",
                data: msgObj,
                headers: {
                'Content-Type': 'application/json'
                }
            });
        },
        buscarPieza: function(idTaller,nombrePieza){
            return $http({
                url: searchUrl2 + 'gpieza/',
                method: "GET",
                params: {idTaller:idTaller,nombrePieza:nombrePieza},
                headers: {
                'Content-Type': 'application/json'
                }
            });
        }
    };
});
var ordenUrl = global_settings.urlCORS + '/api/orden/';

registrationModule.factory('ordenPorCobrarRepository', function ($http) {
    return {
        getOrdenesPorCobrar: function () {
            return $http({
                url: ordenUrl + 'ordenesporcobrar',
                method: "GET"
            });
        }
    };
});
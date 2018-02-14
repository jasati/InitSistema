(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .component('filtro', filtro());

    /* @ngInject */
    function filtro() {
        var component = {
            templateUrl: 'app/blocks/utils/filtro/templates/filtro.html',
            bindings:{
              filtros:'=',
            }
        };

        return component;
    }

})();

(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .component('filtroData', filtroData());

    /* @ngInject */
    function filtroData() {
        var component = {
            templateUrl: 'app/blocks/utils/filtro/templates/filtro-data.html',
            bindings:{
              filtros:'=',
            }
        };

        return component;
    }

})();
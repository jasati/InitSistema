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

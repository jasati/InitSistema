(function() {
    'use strict';

    angular
        .module('cad.modulos')
        .component('modulos', modulos());

    /* @ngInject */
    function modulos() {
        var component = {
            templateUrl: 'app/cadastros/modulossys/templates/modulos.html',
            bindings:{
              funcoes:'<',
            }
        };

        return component;
    }

})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('estacoesPdv', estacoesPdv());

        function estacoesPdv() {
          var component = {
            templateUrl: 'app/sistema/automacao/pdv/templates/pdv.html',
            bindings: {
                funcoes: '<',
            },
          }
          return component;
        }
})();

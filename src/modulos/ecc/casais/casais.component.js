(function() {
    'use strict';
    angular
        .module('app.ecc')
        .component('casais', casais());

        function casais() {
          var component = {
            templateUrl: 'app/sistema/ecc/casais/templates/casais.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

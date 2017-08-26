(function() {
    'use strict';
    angular
        .module('app.ecc')
        .component('encontreiros', encontreiros());

        function encontreiros() {
          var component = {
            templateUrl: 'app/sistema/ecc/encontreiro/templates/encontreiros.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.ecc')
        .component('conjuge', conjuge());

        function conjuge() {
          var component = {
            templateUrl: 'app/sistema/ecc/conjuge/templates/conjuge-cad.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

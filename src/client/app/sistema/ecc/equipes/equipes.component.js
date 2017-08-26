(function() {
    'use strict';
    angular
        .module('app.ecc')
        .component('equipes', equipes());

        function equipes() {
          var component = {
            templateUrl: 'app/sistema/ecc/equipes/templates/equipes.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

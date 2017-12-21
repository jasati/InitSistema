(function() {
    'use strict';
    angular
        .module('app.psclse')
        .component('parametros', parametros());

        function parametros() {
          var component = {
            templateUrl: 'app/sistema/psicanalise/parametros/templates/parametros.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

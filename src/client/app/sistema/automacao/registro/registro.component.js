(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('registro', registro());

        function registro() {
          var component = {
            templateUrl: 'app/sistema/automacao/registro/templates/registro.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();
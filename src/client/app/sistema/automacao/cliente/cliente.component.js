(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('cliente', cliente());

        function cliente() {
          var component = {
            templateUrl: 'app/sistema/automacao/cliente/templates/cliente.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

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

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('clienteCad', clienteCad());

        function clienteCad() {
          var component = {
            templateUrl: 'app/sistema/automacao/cliente/templates/cliente-cad.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();
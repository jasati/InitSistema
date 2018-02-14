(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('vendedores', vendedores());

        function vendedores() {
          var component = {
            templateUrl: 'app/sistema/automacao/vendedor/templates/vendedores.html',
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
        .component('vendedorCad', vendedorCad());

        function vendedorCad() {
          var component = {
            templateUrl: 'app/sistema/automacao/vendedor/templates/vendedor-cad.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();
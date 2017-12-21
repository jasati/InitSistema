(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('inventarioConsulta', inventarioConsulta());

        function inventarioConsulta() {
          var component = {
            templateUrl: 'app/sistema/automacao/inventario/templates/inventarioConsulta.html',
            bindings: {
                inventario: '<',
            }
          }
          return component;
        }
})();
(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('inventarioCadastro', inventarioCadastro());

        function inventarioCadastro() {
          var component = {
            templateUrl: 'app/sistema/automacao/inventario/templates/inventarioCadastro.html',
            bindings: {
                inventario: '<',
            }
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('inventarioDetalhe', inventarioDetalhe());

        function inventarioDetalhe() {
          var component = {
            templateUrl: 'app/sistema/automacao/inventario/templates/inventarioDetalhe.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();


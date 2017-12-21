(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('pgconfig', pgconfig());

        function pgconfig() {
          var component = {
            templateUrl: 'app/sistema/automacao/configuracao/templates/pgconfig.html',
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('configTabPreco', configTabPreco());

        function configTabPreco() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/templates/config-tab-preco.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

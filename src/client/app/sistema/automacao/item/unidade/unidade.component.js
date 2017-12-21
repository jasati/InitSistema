(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('unidade', unidade());

        function unidade() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/unidade/templates/unidade.html',
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
        .component('unidadeCad', unidadeCad());

        function unidadeCad() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/unidade/templates/unidade-cad.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();
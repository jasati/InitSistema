(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('estacoes', estacoes());

        function estacoes() {
          var component = {
            templateUrl: 'app/sistema/automacao/configuracao/estacao/templates/estacoes.html',
            bindings: {
                estacao: '<',
            },
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('estacaoCad', estacaoCad());

        function estacaoCad() {
          var component = {
            templateUrl: 'app/sistema/automacao/configuracao/estacao/templates/estacao-cadastro.html',
            bindings: {
                estacao: '<',
            },
          }
          return component;
        }
})();
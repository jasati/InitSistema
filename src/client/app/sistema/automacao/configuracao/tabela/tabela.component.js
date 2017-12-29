(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('tabelaListagem', tabelaListagem());

        function tabelaListagem() {
          var component = {
            templateUrl: 'app/sistema/automacao/configuracao/tabela/templates/tabela-listagem.html',
            bindings: {
                tabela: '<',
            }
          }
          return component;
        }
})();
(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('tabelaCad', tabelaCad());

        function tabelaCad() {
          var component = {
            templateUrl: 'app/sistema/automacao/configuracao/tabela/templates/tabela-cadastro.html',
            bindings: {
                tabela: '<',
            }
          }
          return component;
        }
})();


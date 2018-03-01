(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('filialListagem', filialListagem());

        function filialListagem() {
          var component = {
            templateUrl: 'app/sistema/automacao/configuracao/filial/templates/filiais.html',
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
        .component('filialCad', filialCad());

        function filialCad() {
          var component = {
            templateUrl: 'app/sistema/automacao/configuracao/filial/templates/filial-cadastro.html',
            bindings: {
              funcoes: '<',
            }
          }
          return component;
        }
})();


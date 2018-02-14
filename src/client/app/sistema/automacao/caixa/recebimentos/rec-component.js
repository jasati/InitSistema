(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('recCxDet', recCxDet());

        function recCxDet() {
          var component = {
            templateUrl: 'app/sistema/automacao/caixa/recebimentos/templates/rec-caixa-detalhes.html',
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
        .component('recCxRes', recCxRes());

        function recCxRes() {
          var component = {
            templateUrl: 'app/sistema/automacao/caixa/recebimentos/templates/rec-caixa-resulmo.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();
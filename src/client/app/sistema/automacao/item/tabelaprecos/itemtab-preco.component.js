(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('tabelaPrecoItem', tabelaPrecoItem());

        function tabelaPrecoItem() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/tabelaprecos/templates/tabelaprecos.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();



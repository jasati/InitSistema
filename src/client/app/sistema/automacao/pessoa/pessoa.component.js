(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('pessoa', pessoa());

        function pessoa() {
          var component = {
            templateUrl: 'app/sistema/automacao/pessoa/templates/pessoa-cad.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('forn', forn());

        function forn() {
          var component = {
            templateUrl: 'app/sistema/automacao/fornecedor/templates/forn.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

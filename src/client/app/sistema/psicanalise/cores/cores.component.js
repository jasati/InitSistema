(function() {
    'use strict';
    angular
        .module('app.psclse')
        .component('cores', cores());

        function cores() {
          var component = {
            templateUrl: 'app/sistema/psicanalise/cores/templates/sessao-wizard.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

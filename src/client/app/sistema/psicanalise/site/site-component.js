(function() {
    'use strict';
    angular
        .module('app.psclse')
        .component('site', site());

        function site() {
          var component = {
            templateUrl: 'app/sistema/psicanalise/site/templates/site.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.ecc')
        .component('encontro', encontro());

        function encontro() {
          var component = {
            templateUrl: 'app/sistema/ecc/encontro/templates/encontros.html',
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
        .module('app.ecc')
        .component('detalhes', detalhes());
        function detalhes() {
          var component = {
            templateUrl: 'app/sistema/ecc/encontro/templates/encontro-detal.html',
            bindings: {
                funcoes:'<',
            }
          }
          return component;
        }
})();

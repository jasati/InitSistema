(function() {
    'use strict';
    angular
        .module('app.ecc')
        .component('encontreiros', encontreiros());

        function encontreiros() {
          var component = {
            templateUrl: 'app/sistema/ecc/casais/templates/encontreiros.html',
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
        .component('encontristas', encontristas());

        function encontristas() {
          var component = {
            templateUrl: 'app/sistema/ecc/casais/templates/encontristas.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

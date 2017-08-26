(function() {
    'use strict';
    angular
        .module('app.ecc')
        .component('encontristas', encontristas());

        function encontristas() {
          var component = {
            templateUrl: 'app/sistema/ecc/encontristas/templates/encontristas.html',
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
        .component('encontristasSel', encontristasSel());

        function encontristasSel() {
          var component = {
            templateUrl: 'app/sistema/ecc/encontristas/templates/encontrista-select.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

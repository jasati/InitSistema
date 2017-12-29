(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('meioPagListagem', meioPagListagem());

        function meioPagListagem() {
          var component = {
            templateUrl: 'app/sistema/automacao/configuracao/meiopag/templates/meiopag-listagem.html',
            bindings: {
              meiopag: '<',
            }
          }
          return component;
        }
})();
(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('meiopagCad', meiopagCad());

        function meiopagCad() {
          var component = {
            templateUrl: 'app/sistema/automacao/configuracao/meiopag/templates/meiopag-cadastro.html',
            bindings: {
              meiopag: '<',
            }
          }
          return component;
        }
})();


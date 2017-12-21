(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('categoria', categoria());

        function categoria() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/categoria/templates/categoria.html',
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
        .component('categoriaCad', categoriaCad());

        function categoriaCad() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/categoria/templates/categoria-cad.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();
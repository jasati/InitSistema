(function() {
    'use strict';

    angular
        .module('cad.perfil')
        .component('perfil', perfil());

    /* @ngInject */
    function perfil() {
        var component = {
            templateUrl: 'app/cadastros/perfil/templates/perfil.html',
            bindings:{
              funcoes:'<',
            }
        };

        return component;
    }

})();

(function() {
    'use strict';
    angular
        .module('cad.perfil')
        .component('permissoes', permissoes());
        function permissoes() {
          var component = {
            templateUrl: 'app/cadastros/perfil/templates/permissoes.html',
            bindings: {
                funcoes:'<',
            }
          }
          return component;
        }

})();

(function() {
    'use strict';
    angular
        .module('cad.perfil')
        .component('perfilModulos', perfilModulos());

        function perfilModulos() {
          var component = {
            templateUrl: 'app/cadastros/perfil/templates/perfil-modulos.html',
            bindings: {
                funcoes: '<',
                perfil:'<',
            }
          }
          return component;
        }
})();

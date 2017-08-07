(function() {
    'use strict';
    angular
        .module('cad.usuario')
        .component('ctrlAcesso', ctrlAcesso());
        function ctrlAcesso() {
          var component = {
            templateUrl: 'app/cadastros/usuario/templates/controle-acesso.html',
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('cad.usuario')
        .component('usuarios', usuarios());

        function usuarios() {
          var component = {
            templateUrl: 'app/cadastros/usuario/templates/usuarios.html',
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
        .module('cad.usuario')
        .component('usuarioCadastro', usuarioCadastro());

        function usuarioCadastro() {
          var component = {
            templateUrl: 'app/cadastros/usuario/templates/usuario-cadastro.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

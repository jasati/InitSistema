(function() {
    'use strict';
    angular
        .module('cad.usuario')
        .component('usuario', {
            templateUrl: 'app/cadastros/usuario/templates/usuario.html',
            controller: UsuarioController,
            bindings: {
                funcoes: '<',
            }
        });
        

        UsuarioController.$inject = [];
        /* @ngInject */
        function UsuarioController(){
            
        	//this.funcoes = new UsuarioFuncService.funcoes(); 
        	//this.funcoes.read();

        }

})();

(function() {
    'use strict';
    angular
        .module('cad.usuario')
        .component('usuarioLista', {
            templateUrl: 'app/cadastros/usuario/templates/usuario-table.html',
            bindings: {
                funcoes: '<',
            }
        });

})();

(function() {
    'use strict';
    angular
        .module('cad.usuario')
        .component('usuarioCadastro', {
            templateUrl: 'app/cadastros/usuario/templates/usuario-cadastro.html',
            bindings: {
                funcoes: '<',
            }
        });

})();
(function() {
    'use strict';

    angular
        .module('cad.usuario')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.usuario',
                config: {
                    url: '/usuario',
                    component:'usuario',
                    settings: {
                        nav    : 2,
                        icon   : 'account_circle',
                        content: 'Controle de Acesso',
                        perm   :1
                    },
                    resolve:{
                        funcoes: function (UsuarioFuncService) {
                            var funcoes = new UsuarioFuncService.funcoes();
                            funcoes.read();
                            funcoes.showTable();
                            return funcoes;
                        }
                    }
                }
            },

            {
                state: 'layout.usuario.lista',
                config: {
                    url:'/lista',
                    component:'usuarioLista',
                    resolve : {
                        funcoes : function (funcoes) {
                            return funcoes
                        }

                    }
                }
            },

            {
                state: 'layout.usuario.cad',
                config: {
                    url:'/cadastro',
                    component:'usuarioCadastro',
                    resolve : {
                        funcoes : function (funcoes) {
                            return funcoes
                        }

                    }
                }
            }            

        ];
    }
})();

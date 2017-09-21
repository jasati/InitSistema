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
                state: 'layout.ctrlAcesso',
                config: {
                    url: '/ctrol-acesso',
                    component:'ctrlAcesso',
                    settings: {
                        nav    : 2,
                        icon   : 'assignment_ind',
                        content: 'Controle de Acesso',
                        perm   :-1
                    },
                    resolve : {
                        funcoes: resolveUsuario
                    }
                }
            },

            {
                state: 'layout.ctrlAcesso.usuarios',
                config: {
                    url:'/usuarios',
                    component:'usuarios',

                }
            },

            {
                state: 'layout.ctrlAcesso.usuarios.cad',
                config: {
                    url:'/cadastro',
                    component:'usuarioCadastro',
                }
            }

        ];
    }
    resolveUsuario.$inject = ['UsuarioFuncService','FiltroService'];

    function resolveUsuario(UsuarioFuncService,FiltroService) {
      var funcoes = new UsuarioFuncService.funcoes();
      //funcoes.showTable();//ir para o state .lista para mostra a lista de usuarios
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.dados.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.dados.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.dados.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.dados.filtros.functionRead();//chama a consulta
      return funcoes;
    }
})();

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
                    title:'Controle de Acesso',
                    settings: {
                        nav    : 2,
                        icon   : 'security',
                        content: 'Controle de Acesso',
                        perm   :5
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
                    title:'Usuários'

                }
            },

            {
                state: 'layout.ctrlAcesso.usuarios.cad',
                config: {
                    url:'/cadastro',
                    component:'usuarioCadastro',
                    title:'Cadastro'
                }
            }

        ];
    }
    resolveUsuario.$inject = ['UsuarioFuncService','FiltroService','$transitions','$state','layoute'];

    function resolveUsuario(UsuarioFuncService,FiltroService,$transitions,$state,layoute) {
      var funcoes = new UsuarioFuncService.funcoes();
      //funcoes.showTable();//ir para o state .lista para mostra a lista de usuarios
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.dados.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.dados.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.dados.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.dados.filtros.functionRead();//chama a consulta
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });            
      return funcoes;
    }
})();

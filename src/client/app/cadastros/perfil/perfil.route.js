(function() {
    'use strict';

    angular
        .module('cad.perfil')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
              state: 'layout.ctrlAcesso.perfils',
              config: {
                  url:'/perfil',
                  component:'perfil',
                  resolve : {
                      funcoes: resolvePerfil
                  }
              }
            },
            {
              state: 'layout.ctrlAcesso.perfils.permissoes',
              config: {
                  url:'/permissoes',
                  component:'permissoes',
                  // resolve : {
                  //     funcoes: function (funcoes) {
                  //         return funcoes
                  //     }
                  // }
              }
            }
        ];
    }
    resolvePerfil.$inject = ['PerfilFuncService','FiltroService'];

    function resolvePerfil(PerfilFuncService,FiltroService) {
      var funcoes = new PerfilFuncService.funcoes();
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.perfil.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.perfil.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.perfil.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.perfil.filtros.functionRead();//chama a consulta
      return funcoes;
    }
})();

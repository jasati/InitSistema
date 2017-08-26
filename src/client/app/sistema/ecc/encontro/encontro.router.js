(function() {
    'use strict';

    angular
        .module('app.ecc')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.ecc',
                config: {
                    url: '/encontro',
                    component:'encontro',
                    settings: {
                        nav    : 3,
                        icon   : 'favorite',
                        content: 'Encontros',
                        perm   :1
                    },
                    resolve : {
                        funcoes: resolveEncontro
                    }
                }
            },

            {
              state: 'layout.ecc.detal',
              config: {
                  url:'/detalhes',
                  component:'detalhes',
              }
            }
        ];
    }
    resolveEncontro.$inject = ['EncontroFuncService','FiltroService'];

    function resolveEncontro(EncontroFuncService,FiltroService) {
      var funcoes = new EncontroFuncService.funcoes();
      //configurar filtros
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.encontro.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.encontro.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.encontro.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.encontro.filtros.functionRead();//chama a consulta
      return funcoes;
    }
})();

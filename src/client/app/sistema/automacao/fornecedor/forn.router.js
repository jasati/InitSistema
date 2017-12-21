(function() {
    'use strict';

    angular
        .module('app.automacao')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.forn',
                config: {
                    url: '/forn',
                    component:'forn',
                    settings: {
                        nav    : 1,
                        icon   : 'location_city',
                        content: 'Fornecedor',
                        perm   :0
                    },
                    resolve : {
                        funcoes: resolveforn
                    }
                }
            }

        ];
    }
    resolveforn.$inject = ['FornFuncService','FiltroService'];

    function resolveforn(FornFuncService,FiltroService) {
      var funcoes = new FornFuncService.funcoes();
      //configurar filtros
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.forn.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.forn.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.forn.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.forn.filtros.functionRead();//chama a consulta
      return funcoes;
    }
})();

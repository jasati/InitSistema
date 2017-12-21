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
                state: 'layout.cliente',
                config: {
                    url: '/cliente',
                    component:'cliente',
                    settings: {
                        nav    : 1,
                        icon   : 'account_box',
                        content: 'Clientes',
                        perm   :0
                    },
                    resolve : {
                        funcoes: resolveCliente
                    }
                }
            }

        ];
    }
    resolveCliente.$inject = ['ClienteFuncService','FiltroService'];

    function resolveCliente(ClienteFuncService,FiltroService) {
      var funcoes = new ClienteFuncService.funcoes();
      //configurar filtros
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.cliente.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.cliente.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.cliente.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.cliente.filtros.functionRead();//chama a consulta
      return funcoes;
    }
})();

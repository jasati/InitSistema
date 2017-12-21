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
                state: 'layout.pgconfig',
                config: {
                    url: '/pgconfig',
                    title:'Configurações',
                    component:'pgconfig',
                    settings: {
                        nav    : 3,
                        icon   : 'settings',
                        content: 'Configurações',
                        perm   :0
                    },
                    resolve : {
                        funcoes: resolveConfig
                    }
                }
            },

            {
              state: 'layout.pgconfig.configtab',
              config: {
                  url:'/tabela-de-preços',
                  component:'configTabPreco',
                  resolve : {
                      funcoes: resolveConfigTabelaPrecos
                  }                  
              }
            }

        ];
    }
    resolveConfigTabelaPrecos.$inject = ['ConfigFuncService','FiltroService'];

    function resolveConfigTabelaPrecos(ConfigFuncService,FiltroService) {
      var funcoes = new ConfigFuncService.funcoes();
      //configurar filtros
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.item.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.item.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.item.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.item.filtros.functionRead();//chama a consulta
      return funcoes;
    }

    resolveConfig.$inject = ['layoute','$transitions','$state'];

    function resolveConfig(layoute,$transitions,$state) {
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
    }

})();

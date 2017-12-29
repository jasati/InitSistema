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
              state: 'layout.pgconfig.tabela',
              config: {
                  url:'/tabela',
                  title:'Tabela',
                  component:'tabelaListagem',
                  resolve : {
                      tabela: resolveTabela
                  }
              }
            },
            {
              state: 'layout.pgconfig.tabela.tabelaCad',
              config: {
                  url:'/cadastro',
                  title:'Cadastro de tabela',
                  component:'tabelaCad',
                  resolve : {
                      tabela: resolveTabelaCad
                  }
              }
            }            

        ];
    }
    resolveTabela.$inject = ['TabelaFuncService','FiltroService','layoute','$transitions','$state'];

    function resolveTabela(TabelaFuncService,FiltroService,layoute,$transitions,$state) {
      var tabela = new TabelaFuncService.funcoes();
      tabela.activate();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return tabela; 
    }
    resolveTabelaCad.$inject = ['TabelaFuncService','FiltroService','layoute','$transitions','$state','tabela'];

    function resolveTabelaCad(TabelaFuncService,FiltroService,layoute,$transitions,$state,tabela) {
      tabela.activate();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return tabela; 
    }    

})();

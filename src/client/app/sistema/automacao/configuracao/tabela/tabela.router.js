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
                  url:'/classificar',
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
                  title:'Cadastro de Classes',
                  component:'tabelaCad',
                  resolve : {
                      tabela: resolveTabelaCad
                  }
              }
            },
            {
              state: 'layout.pgconfig.tabela.tabelaPrazCad',
              config: {
                  url:'/tabelas',
                  title:'Cadastro de tabela',
                  component:'tabelaPrazCad',
                  resolve : {
                      tabela: resolveTabelaCadPraz
                  }
              }
            }

        ];
    }
    resolveTabela.$inject = ['TabelaFuncService','layoute','$transitions','$state'];

    function resolveTabela(TabelaFuncService,layoute,$transitions,$state) {
      var tabela = new TabelaFuncService.funcoes();
      tabela.activate();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return tabela; 
    }
    resolveTabelaCad.$inject = ['layoute','$transitions','$state','tabela'];

    function resolveTabelaCad(layoute,$transitions,$state,tabela) {
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return tabela; 
    }

    resolveTabelaCadPraz.$inject = ['layoute','$transitions','$state','tabela'];

    function resolveTabelaCadPraz(layoute,$transitions,$state,tabela) {
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return tabela; 
    }        

})();

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
              state: 'layout.pgconfig.estacoes',
              config: {
                  url:'/estacoes',
                  title:'Estações de PDV',
                  component:'estacoes',
                  resolve : {
                      estacao: resolveEstacoes
                  }
              }
            },
            {
              state: 'layout.pgconfig.estacoes.estacaoCad',
              config: {
                  url:'/cadastro',
                  title:'Cadastro de estações',
                  component:'estacaoCad',
              }
            }
        ];
    }
    resolveEstacoes.$inject = ['EstacaoFuncService','FiltroService','layoute','$transitions','$state'];

    function resolveEstacoes(EstacaoFuncService,FiltroService,layoute,$transitions,$state) {
      var estacao = new EstacaoFuncService.funcoes();
      estacao.activate();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return estacao; 
    }

})();

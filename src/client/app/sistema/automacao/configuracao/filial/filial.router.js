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
              state: 'layout.pgconfig.filial',
              config: {
                  url:'/filiais',
                  title:'Filiais',
                  component:'filialListagem',
                  resolve : {
                      funcoes: resolveFilial
                  }
              }
            },
            {
              state: 'layout.pgconfig.filial.filialCad',
              config: {
                  url:'/cadastro',
                  title:'Cadastro da filial',
                  component:'filialCad',
              }
            }            

        ];
    }

    resolveFilial.$inject = ['FilialFuncService','$transitions','$state','layoute'];
    function resolveFilial(FilialFuncService,$transitions,$state,layoute) {
      var funcoes = new FilialFuncService.funcoes();
      //configurar filtros
      funcoes.activate();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });      
      return funcoes;
    }

})();

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
              state: 'registrar',
              config: {
                  url:'/registrar',
                  component:'registro',
                  resolve : {
                    funcoes: resolveRegistro
                  }
              }
            }
        ];
    }
    resolveRegistro.$inject = ['RegistroFuncService'];
    function resolveRegistro(RegistroFuncService) {
      var funcoes = new RegistroFuncService.funcoes();
      return funcoes;
    }    
})();

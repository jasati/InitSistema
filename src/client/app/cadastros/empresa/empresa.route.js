(function() {
    'use strict';

    angular
        .module('cad.empresa')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.pgconfig.geral',
                config: {
                    url:'/gerais',
                    title:'Configuração Geral',
                    component:'empresaConfig',
                    resolve : {
                        empresa: resolveConfig
                    }
                }
            }
        ];
    }

    resolveConfig.$inject = ['EmpresaFuncService','FiltroService','layoute','$transitions','$state'];

    function resolveConfig(EmpresaFuncService,FiltroService,layoute,$transitions,$state) {
      var empresa = new EmpresaFuncService.funcoes();
      empresa.load();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return empresa; 
    }

})();

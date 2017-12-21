(function() {
    'use strict';

    angular
        .module('app.psclse')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.param',
                config: {
                    url: '/parametros',
                    component:'parametros',
                    settings: {
                        nav    : 2,
                        icon   : 'settings_applications',
                        content: 'Parametros',
                        perm   : 0
                    },
                    resolve : {
                        funcoes: resolveParametro
                    }
                }
            }
        ];
    }
    resolveParametro.$inject = ['ParamFuncService'];

    function resolveParametro(ParamFuncService) {
      var funcoes = new ParamFuncService.funcoes();

      return funcoes;
    }
})();

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
                state: 'layout.cores',
                config: {
                    url: '/cores',
                    component:'cores',
                    settings: {
                        nav    : 3,
                        icon   : 'invert_colors',
                        content: 'Cores',
                        perm   :0
                    },
                    resolve : {
                        funcoes: resolveCores
                    }
                }
            }
        ];
    }
    resolveCores.$inject = ['CoresFuncService'];

    function resolveCores(CoresFuncService) {
      var funcoes = new CoresFuncService.funcoes();
      return funcoes;
    }
})();

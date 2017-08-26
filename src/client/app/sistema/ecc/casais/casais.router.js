(function() {
    'use strict';

    angular
        .module('app.ecc')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.casais',
                config: {
                    url: '/casais',
                    component:'casais',
                    settings: {
                        nav    : 3,
                        icon   : 'supervisor_account',
                        content: 'Casais',
                        perm   :1
                    },
                    resolve : {
                        funcoes: resolveCasais
                    }
                }
            }
        ];
    }
    resolveCasais.$inject = ['CasaisFuncService'];

    function resolveCasais(CasaisFuncService) {
      var funcoes = new CasaisFuncService.funcoes();
      funcoes.startFiltro('');
      return funcoes;
    }
})();

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
                    url: '/sessao',
                    component:'cores',
                    settings: {
                        nav    : 1,
                        icon   : 'import_contacts',
                        content: 'Sessão',
                        perm   : 0
                    },
                    resolve : {
                        funcoes: resolveCores
                    }
                }
            },
            {
              state: 'layout.cores.swishi',
              config: {
                  url:'/swishi-de-cores',
                  component:'sessaoWizard',
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

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
                state: 'shell.config',
                config: {
                    url: 'config',
                    templateUrl: 'app/empresa/templates/empresa-cadastro.html',
                    controller: 'EmpresaController',
                    controllerAs: 'vm',
                    title: 'Configurações',
                    settings: {
                        nav: 2,
                        icon   : 'settings',
                        content: 'Configurações',
                        perm: 6,
                    }                    
                }
            }
        ];
    }
})();

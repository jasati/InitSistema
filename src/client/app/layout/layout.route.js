(function() {
    'use strict';

    angular
        .module('app.layout')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout',
                config: {
                    url: '/app',
                    title:'Inicio',
                    component:'layoute',
                    resolve : {
                        layoute: resolveLayout
                    }
                }
            }
        ];
    }

    resolveLayout.$inject = ['LayoutService'];

    function resolveLayout(LayoutService) {
        var funcoes = new LayoutService.funcoes();
        funcoes.getNavRoutes();
        return funcoes;
    }    
})();


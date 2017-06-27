(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout.dashboard',
                config: {
                    url: '/dashboard',
                    templateUrl: 'app/sistema/dashboard/templates/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        icon : 'dashboard',
                        content: 'Visão Geral'
                    }
                }
            }
        ];
    }
})();

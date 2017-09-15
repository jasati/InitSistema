(function() {
    'use strict';

    angular
        .module('app.start')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'start',
                config: {
                    url: '/?register?email?externo',
                    component:'start',
                }
            }
        ];
    }
})();

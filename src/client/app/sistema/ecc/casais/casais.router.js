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
              state: 'layout.ecc.detal.encontreiros',
              config: {
                  url:'/encontreiros',
                  component:'encontreiros',
              }
            },
            {
              state: 'layout.ecc.detal.encontristas',
              config: {
                  url:'/encontristas',
                  component:'encontristas',
              }
            }
        ];
    }

})();

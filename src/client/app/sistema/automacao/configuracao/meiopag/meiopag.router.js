(function() {
    'use strict';

    angular
        .module('app.automacao')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
              state: 'layout.pgconfig.meiopag',
              config: {
                  url:'/meiopag',
                  title:'Meios de pagamento',
                  component:'meioPagListagem',
                  resolve : {
                      meiopag: resolveMeioPag
                  }
              }
            }
        ];
    }
    resolveMeioPag.$inject = ['MeioPagFuncService','FiltroService','layoute','$transitions','$state'];

    function resolveMeioPag(MeioPagFuncService,FiltroService,layoute,$transitions,$state) {
      var meiopag = new MeioPagFuncService.funcoes();
      meiopag.activate();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return meiopag; 
    }
})();

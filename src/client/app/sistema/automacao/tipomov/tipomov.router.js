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
                state: 'layout.tipomov',
                config: {
                    url: '/tipomov',
                    component:'viewTipoMov',
                    title:'Tipo de Movimentações',
                    settings: {
                        nav    : 2,
                        icon   : 'swap_vertical_circle',
                        content: 'Movimento de Estoque',
                        perm   : 0
                    },
                    resolve : {
                        tipoMov: resolveTipoMov
                    }
                }
            },
            {
              state: 'layout.pgconfig.tipomovs',
              config: {
                  url:'/tipomov',
                  title:'Tipos de Movimentação',
                  component:'tipomovListagem',
                  resolve : {
                      tipoMov: resolveTipoMov
                  }
              }
            },
            {
              state: 'layout.pgconfig.tipomovs.tipomovcad',
              config: {
                  url:'/cadastro',
                  title:'Cadastro do tipo de movimentação',
                  component:'tipomovCad',
                  resolve : {
                      tipoMov: resolveTipoMovs
                  }
              }
            },

        ];
    }

    resolveTipoMov.$inject = ['TipoMovFuncService','$state','layoute','$transitions'];
    function resolveTipoMov(TipoMovFuncService,$state,layoute,$transitions) {
      var tipoMov = new TipoMovFuncService.funcoes();
      tipoMov.layoute = layoute;
      tipoMov.activate();
      $state.current.data = tipoMov;
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return tipoMov;
    }

    resolveTipoMovs.$inject = ['layoute','$transitions','$state','tipoMov'];
    function resolveTipoMovs(layoute,$transitions,$state,tipoMov) {
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return tipoMov; 
    }

})();

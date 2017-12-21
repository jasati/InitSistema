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
              state: 'layout.tipomov.inventario',
              config: {
                  url:'/inventario',
                  title:'Inventário',
                   views:{
                      '^.^.$default':{
                        component:'inventarioConsulta',
                      }
                   },
                  resolve : {
                      inventario: resolveInventario
                  }
              }
            },
            {
              state: 'layout.tipomov.inventario.cad',
              config: {
                  url:'/cadastro',
                  title:'Cadastro',
                   views:{
                      '^.^.^.$default':{
                        component:'inventarioCadastro',
                      }
                   },
                  resolve : {
                      inventario: resolveCadInventario
                  }
              }
            }            

        ];
    }
    resolveInventario.$inject = ['InventarioFuncService','FiltroService','layoute','$transitions','$state'];

    function resolveInventario(InventarioFuncService,FiltroService,layoute,$transitions,$state) {
      var inventario = new InventarioFuncService.funcoes();
      inventario.layoute = layoute;
      inventario.activate();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return inventario; 
    }

    resolveCadInventario.$inject = ['inventario','$transitions','$state'];
    function resolveCadInventario(inventario,$transitions,$state) {
      $transitions.onSuccess({}, function(transition) {
        inventario.layoute.setPath($state.getCurrentPath());
      });
      return inventario;
    }
})();

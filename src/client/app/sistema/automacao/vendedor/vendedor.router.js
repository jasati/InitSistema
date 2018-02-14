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
                state: 'layout.vendedores',
                config: {
                    url: '/vendedores',
                    component:'vendedores',
                    title:'Vendedores',
                    settings: {
                        nav    : 1,
                        icon   : 'assignment_ind',
                        content: 'Vendedores',
                        perm   : 3
                    },
                    resolve : {
                        funcoes: resolveVendedor
                    }
                }
            },
            {
              state: 'layout.vendedores.cadastro',
              config: {
                  url:'/cadastro',
                  title:'Cadastro de vendedor',
                   views:{
                      '^.^.$default':{
                        component:'vendedorCad',
                      }
                   },
                  // resolve : {
                  //     funcoes: resolveVendedorCad
                  // },
              }
            }

        ];
    }

    resolveVendedor.$inject = ['VendedorFuncService','$transitions','$state','layoute'];
    function resolveVendedor(VendedorFuncService,$transitions,$state,layoute) {
      var funcoes = new VendedorFuncService.funcoes();
      //configurar filtros
      funcoes.activate();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });      
      return funcoes;
    }

    // resolveVendedorCad.$inject = ['$transitions','$state','layoute','funcoes'];
    // function resolveVendedorCad($transitions,$state,layoute,funcoes) {

    //   $transitions.onSuccess({}, function(transition) {
    //     layoute.setPath($state.getCurrentPath());
    //   });      
    //   return funcoes;
    // }

})();

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
                    // views:{
                    //   tipomov:'tipomov',
                    // },
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
              state: 'layout.tipomov.movs',
              config: {
                  url:'/{tipomovDesc}',
                  title:'Movimentações',
                  //component:'movs',
                   views:{
                      '^.^.$default':{
                        component:'movs',
                      }
                   },
                  resolve : {
                      movs: resolveMovs
                  },
              }
            },

            {
              state: 'layout.tipomov.movs.mov',
              config: {
                  url:'/movimento',
                  title:'Movimento',
                   views:{
                      '^.^.^.$default':{
                        component:'movimento',
                      }
                   },
                  resolve : {
                      movimento: resolveMovimento
                  }
              }
            },

            {
              state: 'layout.tipomov.mov.movitens',
              config: {
                  component:'itemEstoque',
              }
            }
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

    resolveMovs.$inject = ['MovFuncService','$transition$','$state','layoute','tipoMov'];
    function resolveMovs(MovFuncService,$transition$,$state,layoute,tipoMov) {
      var movs = new MovFuncService.funcoes();
      movs.tipoMov = tipoMov;
      //fazer o filtro para exibir somente as movs do tipoMov selecionado
      movs.data.filtroExterno = ' and id_tipo_mov = '+movs.tipoMov.data.row.id_tipo_mov;
      movs.activate();
      return movs;
    }

    resolveMovimento.$inject = ['MovFuncService','$transition$','movs'];
    function resolveMovimento(MovFuncService,$transition$,movs) {
      movs.startMovimento();
      return movs;
    }    
})();

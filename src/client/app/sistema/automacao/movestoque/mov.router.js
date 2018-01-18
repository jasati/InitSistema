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

    resolveMovs.$inject = ['MovFuncService','$transition$','$state','layoute','tipoMov'];
    function resolveMovs(MovFuncService,$transition$,$state,layoute,tipoMov) {
      var movs = new MovFuncService.funcoes();
      movs.tipoMov = tipoMov;
      //fazer o filtro para exibir somente as movs do tipoMov selecionado
      movs.data.filtroExterno = ' and em.id_tipo_mov = '+movs.tipoMov.data.row.id_tipo_mov;
      movs.movDataItens.data.filtroExterno = ' and em.id_tipo_mov = '+movs.tipoMov.data.row.id_tipo_mov;
      movs.activate();
      return movs;
    }

    resolveMovimento.$inject = ['MovFuncService','$transition$','movs'];
    function resolveMovimento(MovFuncService,$transition$,movs) {
      movs.startMovimento();
      return movs;
    }    
})();

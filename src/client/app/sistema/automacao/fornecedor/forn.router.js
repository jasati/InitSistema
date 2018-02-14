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
                state: 'layout.forn',
                config: {
                    url: '/forn',
                    component:'forn',
                    settings: {
                        nav    : 1,
                        icon   : 'location_city',
                        content: 'Fornecedor',
                        perm   : 2
                    },
                    resolve : {
                        funcoes: resolveforn
                    }
                }
            },
            {
              state: 'layout.forn.cadastro',
              config: {
                  url:'/cadastro',
                  title:'Cadastro',
                   views:{
                      '^.^.$default':{
                        component:'fornCad',
                      }
                   },
                  resolve : {
                      funcoes: resolveFornCad
                  },
              }
            }            

        ];
    }
    resolveforn.$inject = ['FornFuncService','FiltroService','$transitions','$state','layoute'];

    function resolveforn(FornFuncService,FiltroService,$transitions,$state,layoute) {
      var funcoes = new FornFuncService.funcoes();
      //configurar filtros
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.forn.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.forn.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.forn.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.forn.filtros.functionRead();//chama a consulta
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });            
      return funcoes;
    }
    resolveFornCad.$inject = ['$transitions','$state','layoute','funcoes'];
    function resolveFornCad($transitions,$state,layoute,funcoes) {

      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });
      return funcoes;
    }


})();

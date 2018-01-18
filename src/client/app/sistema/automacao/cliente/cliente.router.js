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
                state: 'layout.cliente',
                config: {
                    url: '/cliente',
                    component:'cliente',
                    settings: {
                        nav    : 1,
                        icon   : 'account_box',
                        content: 'Clientes',
                        perm   :0
                    },
                    resolve : {
                        funcoes: resolveCliente
                    }
                }
            },
            {
              state: 'layout.cliente.cadastro',
              config: {
                  url:'/cadastro',
                  title:'Cadastro',
                   views:{
                      '^.^.$default':{
                        component:'clienteCad',
                      }
                   },
                  resolve : {
                      funcoes: resolveClienteCad
                  },
              }
            }

        ];
    }

    resolveCliente.$inject = ['ClienteFuncService','FiltroService','$transitions','$state','layoute'];
    function resolveCliente(ClienteFuncService,FiltroService,$transitions,$state,layoute) {
      var funcoes = new ClienteFuncService.funcoes();
      //configurar filtros
      var funcFiltros = new FiltroService.funcoes();
      var toobarPrm = {
        btAddNovo  : funcoes.novo,
        btAddTootip: 'Novo Cliente',
      };      
      funcFiltros.filtros.fields = funcoes.cliente.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.cliente.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.cliente.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.cliente.setToolbar(toobarPrm);
      funcoes.cliente.setTable({alterar:funcoes.alterar});
      funcoes.cliente.setPagination();      
      funcoes.cliente.filtros.functionRead();//chama a consulta
      funcoes.filtrarTabela();
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });      
      return funcoes;
    }

    resolveClienteCad.$inject = ['$transitions','$state','layoute','funcoes'];
    function resolveClienteCad($transitions,$state,layoute,funcoes) {

      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });      
      return funcoes;
    }

})();

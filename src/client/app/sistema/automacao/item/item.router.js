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
                state: 'layout.pgitem',
                config: {
                    url: '/pgitem',
                    component:'pgitem',
                    title:'Modulo de Itens',
                    settings: {
                        nav    : 2,
                        icon   : 'view_module',
                        content: 'Itens',
                        perm   : 4
                    },
                    resolve : {
                        funcoes: resolveItem
                    }
                }
            },

            {
              state: 'layout.pgitem.cadastros',
              config: {
                  title:'Listagem',
                  url:'/cadastros',
                  component:'itemCadastros',
                  resolve : {
                      funcoes: resolveCadastros
                  }
              }
            },

            {
              state: 'layout.pgitem.cadastros.item',
              config: {
                  title:'Cadastro',
                  url:'/item',
                   views:{
                      '^.^.^.$default':{
                        component:'item',
                      }
                   },
              }
            },

            {
              state: 'layout.pgitem.estoque',
              config: {
                  title:'Listagem de Estoque',
                  url:'/estoque',
                  component:'itemEstoque',
                  resolve : {
                      funcoes: resolveEstoque
                  }
              }
            },

            {
              state: 'layout.pgitem.tabela',
              config: {
                  url:'/tabela',
                  title:'Tabelas de preço',
                  component:'itemTabela',
                  resolve : {
                      funcoes: resolveTabela
                  }
              }
            }
        ];
    }
    resolveItem.$inject = ['ItemFuncService','layoute','$transitions','$state'];

    function resolveItem(ItemFuncService,layoute,$transitions,$state) {
      var funcoes = new ItemFuncService.funcoes();
      funcoes.activate();
      funcoes.layoute = layoute;
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });      
      return funcoes;
    }

    resolveCadastros.$inject = ['funcoes'];
    function resolveCadastros(funcoes) {
      funcoes.item.acionarMainFiltro();
      return funcoes;
    }

    resolveEstoque.$inject = ['funcoes'];
    function resolveEstoque(funcoes) {
      funcoes.setTabelaPadrao();
      funcoes.filtrar();
      return funcoes;
    }

    resolveTabela.$inject = ['ItemTabFuncService','FiltroService','layoute','$transitions','$state'];

    function resolveTabela(ItemTabFuncService,FiltroService,layoute,$transitions,$state) {
      var funcoes = new ItemTabFuncService.funcoes();
      //configurar filtros
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.item.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.item.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.item.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.layoute = layoute;
      $transitions.onSuccess({}, function(transition) {
        layoute.setPath($state.getCurrentPath());
      });            
      return funcoes.item.filtros.functionRead().then(function (resp) {
        return funcoes;
      });
      
    }    
})();

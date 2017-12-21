(function() {
    'use strict';

    angular
        .module('app.automacao')
        .run(appRun);

    appRun.$inject = ['routerHelper','$rootScope','$state','$stateParams'];
    /* @ngInject */
    function appRun(routerHelper,$rootScope,$state,$stateParams) {
        routerHelper.configureStates(getStates());
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }

    function getStates() {
        return [
            {
                state: 'layout.pgitem.categoria',
                config: {
                    url: '/categoria',
                    component:'categoria',
                    resolve : {
                        funcoes: resolveCategoria
                    }
                }
            },

            {
              state: 'layout.pgitem.categoria.cadastro',
              config: {
                  url:'/cadastro',
                  component:'categoriaCad',
              }
            }
        ];
    }
    resolveCategoria.$inject = ['CategoriaFuncService','FiltroService'];

    function resolveCategoria(CategoriaFuncService,FiltroService) {
      var funcoes = new CategoriaFuncService.funcoes();
      //configurar filtros
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.categoria.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.categoria.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcFiltros.filtros.placeholder = 'Localizar Categoria';
      funcFiltros.filtros.functionDinamic = funcoes.filtroAutoComplete;//função que aciona o auto complete do filtro
      funcoes.categoria.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.setToolbar();//configura os enventos do toolbar. obs: esse função deve ser sempre depois da injeção do filtro
      funcoes.setTable();
      funcoes.setPagination();
      funcoes.categoria.filtros.functionRead();//chama a consulta
      return funcoes;
    }

})();

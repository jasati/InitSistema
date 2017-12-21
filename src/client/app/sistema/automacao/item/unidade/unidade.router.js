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
                state: 'layout.pgitem.unidade',
                config: {
                    url: '/unidade',
                    component:'unidade',
                    resolve : {
                        funcoes: resolveUnidade
                    }
                }
            },

            {
              state: 'layout.pgitem.unidade.cadastro',
              config: {
                  url:'/cadastro',
                  component:'unidadeCad',
              }
            }
        ];
    }
    resolveUnidade.$inject = ['UnidadeFuncService','FiltroService'];

    function resolveUnidade(UnidadeFuncService,FiltroService) {
      var funcoes = new UnidadeFuncService.funcoes();
      //configurar filtros
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.unidade.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.unidade.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcFiltros.filtros.placeholder = 'Localizar Unidade de medida';
      funcFiltros.filtros.functionDinamic = funcoes.filtroAutoComplete;//função que aciona o auto complete do filtro
      funcoes.unidade.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.setToolbar();//configura os enventos do toolbar. obs: esse função deve ser sempre depois da injeção do filtro
      funcoes.setTable();
      funcoes.setPagination();
      funcoes.unidade.filtros.functionRead();//chama a consulta
      return funcoes;
    }

})();

(function() {
    'use strict';

    angular
        .module('cad.modulos')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
              state: 'layout.usuario.modulos',
              config: {
                  url:'/modulos',
                  component:'modulos',
                  resolve : {
                      funcoes: resolveModulos
                  }
              }
            }
        ];
    }
    resolveModulos.$inject = ['PerfilFuncService','FiltroService'];

    function resolveModulos(PerfilFuncService,FiltroService) {
      var funcoes = new PerfilFuncService.funcoes();
      var funcFiltros = new FiltroService.funcoes();
      funcFiltros.filtros.fields = funcoes.dados.camposFiltro;//setar os campos de consulta
      funcFiltros.filtros.fildsQuery = funcoes.dados.filtroDefault;//setar o filtro default
      funcFiltros.filtros.functionRead = funcoes.filtrar;//setar a função de gatilho para consulta
      funcoes.dados.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
      funcoes.dados.filtros.functionRead();//chama a consulta
      return funcoes;
    }
})();

(function() {
    'use strict';

    angular
        .module('cad.modulos')
        .service('ModulosFuncService', ModulosFuncService);

    ModulosFuncService.$inject = ['UtilsFunctions','Dataset','UtilsDataFunctionService','FiltroService'];

    /* @ngInject */
    function ModulosFuncService(UtilsFunctions,Dataset,UtilsDataFunctionService,FiltroService) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var modulos = Dataset.perfilModulos();
          var modulosGrp = Dataset.modulosGrp();
          vm.data = new UtilsDataFunctionService.dataFuncoes(modulos)
          vm.modulosGrp = new UtilsDataFunctionService.dataFuncoes(modulosGrp)
          vm.title = 'Permissões de acesso';

          vm.activate = function () {
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.data.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.data.filtros.functionRead();//chama a consulta
          }

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.data.rowParent)) {
              query += " and pm.id_perfil = "+vm.data.rowParent.id_perfil;
            }
            vm.data.read(query);
          }
          vm.filtrarModulosGrp = function () {
            var query = '';
            vm.modulosGrp.read(query);
          }
        }
    }
})();

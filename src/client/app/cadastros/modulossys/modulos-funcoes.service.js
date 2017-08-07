(function() {
    'use strict';

    angular
        .module('cad.modulos')
        .service('ModulosFuncService', ModulosFuncService);

    ModulosFuncService.$inject = ['UtilsFunctions','Dataset','UtilsDataFunctionService'];

    /* @ngInject */
    function ModulosFuncService(UtilsFunctions,Dataset,UtilsDataFunctionService) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var modulos = Dataset.modulos();
          var modulosGrp = Dataset.modulosGrp();
          vm.modulos = new UtilsDataFunctionService.dataFuncoes(modulos)
          vm.modulosGrp = new UtilsDataFunctionService.dataFuncoes(modulosGrp)
          vm.title = 'Permissões de acesso';

          vm.filtrarModulos = function () {
            var query = '';
            vm.modulos.read(query);
          }
          vm.filtrarModulosGrp = function () {
            var query = '';
            vm.modulosGrp.read(query);
          }
        }
    }
})();

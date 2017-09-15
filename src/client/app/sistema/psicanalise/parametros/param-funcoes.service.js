(function() {
    'use strict';

    angular
        .module('app.psclse')
        .service('ParamFuncService', ParamFuncService);

    ParamFuncService.$inject = [
      'UtilsFunctions','PsicanaliseDataset','UtilsDataFunctionService','FiltroService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function ParamFuncService(
      UtilsFunctions,PsicanaliseDataset,UtilsDataFunctionService,FiltroService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

      function funcoes() {
        var vm = this;
        var isset = UtilsFunctions.isset;
        var dataSetProvider = PsicanaliseDataset.configShowCor();
        vm.param = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
        vm.divider = 'botton';
        vm.title = 'Parâmetros do sistema';

        vm.filtrar = function () {
          vm.param.read('').then(function (result) {
            vm.param.alterar(result.reg[0]);//colocar o primeiro registro em row para ser visto no tela
          });
        }

        vm.startFiltro = function () {
          // função para instanciar o modulo de filtros
          // so deve ser chamado uma vez apos criado
          var funcFiltros = new FiltroService.funcoes();
          funcFiltros.filtros.fields = vm.param.camposFiltro;//setar os campos de consulta
          funcFiltros.filtros.fildsQuery = vm.param.filtroDefault;//setar o filtro default
          funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
          vm.param.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
          vm.param.filtros.functionRead();//chama a consulta
        }

        function activate() {
          vm.startFiltro();
        }
        activate();


      }
    }
})();

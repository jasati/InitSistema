(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('TabelaFuncService', TabelaFuncService);

    TabelaFuncService.$inject = [
      'UtilsFunctions','TabelaDataSet','UtilsDataFunctionService','FiltroService','TabPrazosFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function TabelaFuncService(
      UtilsFunctions,TabelaDataSet,UtilsDataFunctionService,FiltroService,TabPrazosFuncService,
      $state,$mdDialog,$filter
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetTabela = new TabelaDataSet.tabela();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetTabela);
          vm.tabPrazos = new TabPrazosFuncService.funcoes();
          vm.data.title = "Classificar tabelas";
          vm.tipos = [
            {descricao:'ATACADO',value:'A'},
            {descricao:'VAREJO',value:'V'},
          ];
          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Nova Classe',
            };
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionDinamic = vm.filtroAutoComplete;//função que aciona o auto complete do filtro
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.data.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.data.setToolbar(toobarPrm);
            vm.data.setTable({alterar:vm.alterar});
            vm.data.setPagination();
            vm.data.filtros.functionRead();//chama a consulta
          }

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.data.filtros.mainField)) {
              query += " and descricao LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and descricao LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.novo = function () {
            var data = {};
            vm.data.novo(data,'layout.pgconfig.tabela.tabelaCad');
            vm.tabPrazos.start(vm);
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.pgconfig.tabela.tabelaCad');
            vm.tabPrazos.start(vm);
          }

        }
    }
})();

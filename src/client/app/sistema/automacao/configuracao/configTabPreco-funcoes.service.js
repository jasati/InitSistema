(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('ConfigTabPrecoFuncService', ConfigTabPrecoFuncService);

    ConfigTabPrecoFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService','ConfigTabPrecoItensFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function ConfigTabPrecoFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,ConfigTabPrecoItensFuncService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetTabela = AutomacaoDataset.classeTabela();
          var dataSetTabelaItens = AutomacaoDataset.tabelaItensPreco();
          vm.tabela = new UtilsDataFunctionService.dataFuncoes(dataSetTabela);
          vm.TabItens = new ConfigTabPrecoItensFuncService.funcoes(null);
          vm.divider = 'botton';
          vm.title = 'Configurações da Tabela de Preços';

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.tabela.filtros.mainField)) {
              query += " and descricao LIKE '%"+vm.tabela.filtros.mainField+"%'";
            }
            vm.tabela.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm,id) {
            var query = "";
            if (isset(prm)) {
              query += " and descricao LIKE '"+prm+"%'";
            }
            if (isset(id)) {
              query += " and id_tabela_preco = "+id;
            }
            return vm.tabela.load(query,true).then(function (result) {
              return result.reg;
            });
          }
          vm.deletar = function (ev,data) {
            vm.tabela.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.tabela.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

        }
    }
})();

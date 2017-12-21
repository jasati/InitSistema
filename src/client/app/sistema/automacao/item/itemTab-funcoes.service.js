(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('ItemTabFuncService', ItemTabFuncService);

    ItemTabFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function ItemTabFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = AutomacaoDataset.tabelaItem();
          var dataSetTabela = AutomacaoDataset.classeTabela();
          vm.item = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.tabelas = new UtilsDataFunctionService.dataFuncoes(dataSetTabela);
          vm.class_tab = '0';
          vm.divider = 'botton';
          vm.title = 'Modulo de item';

          vm.tabela = function () {
            for (var prop in vm.item.rows[0]) {
              if (vm.item.rows[0].hasOwnProperty(prop)){
                if (prop!='$$hashKey') {
                  if (prop=='item') {
                    var col = {
                      name:'Item',
                      prop:prop,
                      width :60,
                    };
                  } else {
                    var col = {
                      name:prop,
                      prop:prop,
                      width :5,
                    };
                  }

                  vm.item.table.columns.push(col);
                }
              }
            }

          }

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.item.filtros.mainField)) {
              query += " and item LIKE '"+vm.item.filtros.mainField+"%'";
            };
            if (vm.class_tab!='0') {
              dataSetProvider.tab = vm.class_tab;
            } else {
              dataSetProvider.tab = '';
            }
            return vm.item.procedureSql(query,true).then(function (resp) {
              if (vm.item.table.columns.length == 0) {
                vm.tabela();
              }
              return resp;

            });
          }

          vm.clearTabela = function () {
            vm.item.table.columns = [];
          }
          vm.filtrarTabela = function () {
            if (vm.tabelas.rows.length == 0) {
              vm.tabelas.read('');
            }
          }

        }
    }
})();

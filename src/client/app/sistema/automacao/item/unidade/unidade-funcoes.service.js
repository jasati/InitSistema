(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('UnidadeFuncService', UnidadeFuncService);

    UnidadeFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService',
      '$state','$mdDialog','$filter','$rootScope','$stateParams'
    ];

    /* @ngInject */
    function UnidadeFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,
      $state,$mdDialog,$filter,$rootScope,$stateParams
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = AutomacaoDataset.unidade();
          vm.unidade = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.divider = 'botton';
          vm.title = 'Unidade de Medida dos Itens';

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.unidade.filtros.mainField)) {
              query += " and descricao LIKE '%"+vm.unidade.filtros.mainField+"%'";
            }
            vm.unidade.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and descricao LIKE '%"+prm+"%'";
            return vm.unidade.read(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.novo = function () {
            vm.cadastro('create',{id_unidade:null})
          }

          vm.alterar = function (row) {
            vm.cadastro('update',row);
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.unidade.novo(row);
                break;
              case 'update':
                vm.unidade.alterar(row);
                break;
              default:
            }

            var config = {
              templateUrl: 'app/sistema/automacao/item/unidade/templates/unidade-cad.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            vm.unidade.showModal(config);
          }

          vm.deletar = function (ev,data) {
            vm.unidade.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.unidade.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.deleteAll = function (ev) {
            for (var i = 0; i < vm.unidade.rowsSelected.length; i++) {
              vm.unidade.remover(vm.unidade.rowsSelected[i]);
            }
            vm.unidade.confirmDel(ev,'Todos os registros selecionados').then(function (result) {
              if (result) {
                vm.unidade.aplyUpdates(/*atualizar apos a alterao*/true).then(function (result) {
                  if (result) {
                    vm.unidade.rowsSelected = [];
                  }
                });
              }
            });
          }

          vm.setToolbar = function () {
            vm.toolbarFunc = {
              toolbarModelo : '1',//com botao novo
              mediaxs       : vm.unidade.mediaxs,
              btAddNovo     : vm.novo,
              btAddTootip   : 'Nova unidade',
              title         : vm.title,
              filtros       : vm.unidade.filtros,
              report        : '',
            };
          }

          vm.setTable = function () {
            vm.table = {
              responsive:true,
              dados     :vm.unidade,
              colunas   :dataSetProvider.tableCols,
              id        :dataSetProvider.id_tabela,
              alterar   :vm.alterar,
              deleteAll :vm.deleteAll,
            }
          }
          vm.setPagination = function () {
            vm.pagination = {
              dados     :vm.unidade,
              filtrar   :vm.filtrar,
            }
          }

          vm.state = function () {
            return $state.current.component;
          }

        }
    }
})();

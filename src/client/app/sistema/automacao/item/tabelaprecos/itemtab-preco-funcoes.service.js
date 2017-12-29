(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('ItemTabPrecoFuncService', ItemTabPrecoFuncService);

    ItemTabPrecoFuncService.$inject = [
      'UtilsFunctions','InventarioDataSet','UtilsDataFunctionService','FiltroService','ItemTabPrecoDataSet',
      '$state','$mdDialog','$filter','logger'
    ];

    /* @ngInject */
    function ItemTabPrecoFuncService(
      UtilsFunctions,InventarioDataSet,UtilsDataFunctionService,FiltroService,ItemTabPrecoDataSet,
      $state,$mdDialog,$filter,logger
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetMaster = new ItemTabPrecoDataSet.dataSetMaster();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetMaster);
          vm.data.title = "Tabela de Preços dos itens";
          var masterData = null;
          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Nova tabela de preço',
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

          vm.setMasterData = function (row) {
            masterData = row;
            vm.filtrar();
          }

          vm.filtrar = function () {
            if (isset(masterData)) {
              var query = ' and itp.id_item = '+masterData.id_item;
              if (isset(vm.data.filtros.mainField)) {
                query += " and CONCAT(t.descricao,' ',tp.descricao) LIKE '"+vm.data.filtros.mainField+"%'";
              }
              vm.data.read(query,false);//limitar os registro
            } else {
              logger.warning('Atenção! o masterData não foi definido.');
            }
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and CONCAT(t.descricao,' ',tp.descricao) LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.changeAutoComplete = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.parent)) {

              }
            } else {

            }
          }          


          vm.novo = function () {
            vm.cadastro('create',{id_tabela_preco:null})
          }

          vm.alterar = function (row) {
            vm.cadastro('update',row);
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.data.novo(row);
                break;
              case 'update':
                vm.data.alterar(row);
                break;
              default:
            }

            var config = {
              templateUrl: 'app/sistema/automacao/item/tabelaprecos/templates/tabelapreco-cad.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            vm.data.showModal(config);
          }

          vm.deletar = function (ev,data) {
            vm.data.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.data.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.deleteAll = function (ev) {
            for (var i = 0; i < vm.data.rowsSelected.length; i++) {
              vm.data.remover(vm.data.rowsSelected[i]);
            }
            vm.data.confirmDel(ev,'Todos os registros selecionados').then(function (result) {
              if (result) {
                vm.data.aplyUpdates(/*atualizar apos a alterao*/true).then(function (result) {
                  if (result) {
                    vm.data.rowsSelected = [];
                  }
                });
              }
            });
          }

        }
    }
})();

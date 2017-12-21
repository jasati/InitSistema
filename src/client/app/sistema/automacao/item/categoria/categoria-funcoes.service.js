(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('CategoriaFuncService', CategoriaFuncService);

    CategoriaFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService',
      '$state','$mdDialog','$filter','$rootScope','$stateParams'
    ];

    /* @ngInject */
    function CategoriaFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,
      $state,$mdDialog,$filter,$rootScope,$stateParams
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = AutomacaoDataset.categoria();
          vm.categoria = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.catParent = [];
          vm.divider = 'botton';
          vm.title = 'Categoría dos Itens';

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.categoria.filtros.mainField)) {
              var f = 'CASE WHEN ca.descricao is null AND cp.descricao is null THEN CONCAT(cf.descricao) WHEN ca.descricao is null THEN CONCAT(cp.descricao," > ",cf.descricao) ELSE CONCAT(ca.descricao," > ",cp.descricao," > ",cf.descricao) END';
              query += " and cf.descricao LIKE '"+vm.categoria.filtros.mainField+"%'";
            }
            vm.categoria.read(query,true);
          }

          vm.filtroAutoComplete = function (prm,id) {
            var f = 'CASE WHEN ca.descricao is null AND cp.descricao is null THEN CONCAT(cf.descricao) WHEN ca.descricao is null THEN CONCAT(cp.descricao," > ",cf.descricao) ELSE CONCAT(ca.descricao," > ",cp.descricao," > ",cf.descricao) END';
            var query = " and "+f+" LIKE '%"+prm+"%'";
            if (isset(id)) {
              query += " and cf.id_categoria <> "+id;
            }
            return vm.categoria.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.changeAutoComplete = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.parent)) {
                rowEdit.parent = rowSelect.parent;
                rowEdit.id_cat_pai = rowSelect.id_categoria;
              }
            } else {
              rowEdit.parent = rowEdit.descricao;
              rowEdit.id_cat_pai = null;
            }
          }


          vm.novo = function () {
            vm.cadastro('create',{id_categoria:null})
          }

          vm.alterar = function (row) {
            vm.cadastro('update',row);
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.categoria.novo(row);
                break;
              case 'update':
                vm.categoria.alterar(row);
                break;
              default:
            }

            var config = {
              templateUrl: 'app/sistema/automacao/item/categoria/templates/categoria-cad.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            vm.categoria.showModal(config);
          }

          vm.deletar = function (ev,data) {
            vm.categoria.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.categoria.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.deleteAll = function (ev) {
            for (var i = 0; i < vm.categoria.rowsSelected.length; i++) {
              vm.categoria.remover(vm.categoria.rowsSelected[i]);
            }
            vm.categoria.confirmDel(ev,'Todos os registros selecionados').then(function (result) {
              if (result) {
                vm.categoria.aplyUpdates(/*atualizar apos a alterao*/true).then(function (result) {
                  if (result) {
                    vm.categoria.rowsSelected = [];
                  }
                });
              }
            });
          }

          vm.setToolbar = function () {
            vm.toolbarFunc = {
              toolbarModelo : '1',//com botao novo
              mediaxs       : vm.categoria.mediaxs,
              btAddNovo     : vm.novo,
              btAddTootip   : 'Nova categoria',
              title         : vm.title,
              filtros       : vm.categoria.filtros,
              report        : '',
            };
          }

          vm.setTable = function () {
            vm.table = {
              responsive:true,
              dados     :vm.categoria,
              colunas   :dataSetProvider.tableCols,
              id        :dataSetProvider.id_tabela,
              alterar   :vm.alterar,
              deleteAll :vm.deleteAll,
            }
          }
          vm.setPagination = function () {
            vm.pagination = {
              dados     :vm.categoria,
              filtrar   :vm.filtrar,
            }
          }

          vm.state = function () {
            return $state.current.component;
          }

        }
    }
})();

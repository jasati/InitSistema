(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('InventarioFuncService', InventarioFuncService);

    InventarioFuncService.$inject = [
      'UtilsFunctions','InventarioDataSet','UtilsDataFunctionService','FiltroService','CategoriaFuncService','ItemFuncService','InvItensFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function InventarioFuncService(
      UtilsFunctions,InventarioDataSet,UtilsDataFunctionService,FiltroService,CategoriaFuncService,ItemFuncService,InvItensFuncService,
      $state,$mdDialog,$filter
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetMaster = new InventarioDataSet.dataSetMaster();
          var dataSetDetalhe = new InventarioDataSet.dataSetDetalhe();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetMaster);
          vm.categoria = new CategoriaFuncService.funcoes();
          vm.estoque = new ItemFuncService.funcoes();
          vm.data.title = "Inventário de estoque";
          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Novo Inventário',
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
              query += " and pessoa_mov_nome_comp LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and pessoa_mov_nome_comp LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.changeAutoComplete = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.parent)) {
                rowEdit.categoria = rowSelect.descricao;
                rowEdit.id_categoria = rowSelect.id_categoria;
              }
            } else {
              rowEdit.categoria = '';
              rowEdit.id_categoria = null;
            }
          }          

          vm.showItensCat = function (cat) {
            if (isset(cat)) {
              var query = 'CASE WHEN ca.descricao is null AND cp.descricao is null THEN CONCAT(cf.descricao) '+
              'WHEN ca.descricao is null THEN CONCAT(cp.descricao," > ",cf.descricao) '+
              'ELSE CONCAT(ca.descricao," > ",cp.descricao," > ",cf.descricao) END';
              vm.estoque.item.filtroExterno = " and "+query+" LIKE '%"+cat+"%'";
              vm.estoque.item.dataSetProvider.modCamposTab(false);
              vm.estoque.item.read('',false);
            }

          }

          vm.novo = function () {
            var data = {
              id_filial:1,
              data_cad:new Date(),
              status :0,
            };
            vm.data.novo(data,'layout.tipomov.inventario.cad');
            vm.data.setNewChilder(InvItensFuncService,vm.data.row,false);
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.tipomov.inventario.cad');
            vm.data.setNewChilder(InvItensFuncService,row,true);
          }


          vm.confirmarItens = function () {
            vm.data.salvar().then(function (result) {
              if (result) {
                vm.data.row.child.data.setForengKey(vm.data.row.id_inventario,1);
                vm.data.row.child.addItens(vm.estoque.item.rows);
                vm.data.row.child.data.aplyUpdates(false).then(function (result) {
                  if (result) {
                    vm.data.row.child.activate();
                  }
                });
              }
            });
          }

          vm.confirmarContagem = function () {
            vm.data.row.child.data.aplyUpdates(true).then(function (result) {
              if (result) {
                vm.data.row.status = 1;
                vm.data.salvar();
              }
            });
          }

        }
    }
})();

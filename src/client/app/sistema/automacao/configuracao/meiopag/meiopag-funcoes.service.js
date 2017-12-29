(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('MeioPagFuncService', MeioPagFuncService);

    MeioPagFuncService.$inject = [
      'UtilsFunctions','MeioPagDataSet','UtilsDataFunctionService','FiltroService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function MeioPagFuncService(
      UtilsFunctions,MeioPagDataSet,UtilsDataFunctionService,FiltroService,
      $state,$mdDialog,$filter
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetMeioPag = new MeioPagDataSet.meiopag();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetMeioPag);
          vm.data.title = "Meios de Pagamentos";
          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Novo meio de pagamento',
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
            return vm.data.load(query,false).then(function (result) {
              return result.reg;
            });
          }

          vm.novo = function () {
            vm.cadastro('create',{id_meio_pag:null})
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
              templateUrl: 'app/sistema/automacao/configuracao/meiopag/templates/meiopag-cadastro.html',
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

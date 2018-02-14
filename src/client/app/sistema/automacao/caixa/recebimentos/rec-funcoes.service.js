(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('RecFuncService', RecFuncService);

    RecFuncService.$inject = [
      'UtilsFunctions','RecDataSet','UtilsDataFunctionService','FiltroService','MeioPagFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function RecFuncService(
      UtilsFunctions,RecDataSet,UtilsDataFunctionService,FiltroService,MeioPagFuncService,
      $state,$mdDialog,$filter
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSet = new RecDataSet.rec();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSet);
          vm.meiopag = new MeioPagFuncService.funcoes();
          vm.data.title = "Recebimentos";
          vm.totalRec = 0;
          vm.sumQry = true;
          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Novo Recebimento',
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
            vm.data.filtros.setFiltroData(vm.data.filtroData);
            vm.data.filtros.functionRead();//chama a consulta
          }

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.data.filtros.mainField)) {
              query += " and mp.descricao LIKE '"+vm.data.filtros.mainField+"%'";
            }
            if (isset(vm.data.rowParent)) {
              if (isset(vm.data.rowParent.id_caixa)) {
                query += " and r.id_caixa = "+vm.data.rowParent.id_caixa;
              }
            }
            if (vm.sumQry) {
              vm.data.dataSetProvider.groupBy = 'r.id_meio_pag';
            } else {
              vm.data.dataSetProvider.groupBy = 'r.data_rec';
            }
            return vm.data.read(query,true).then(function (result) {
              return result;
            })
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and mp.descricao LIKE '"+prm+"%'";
            return vm.data.load(query,false).then(function (result) {
              return result.reg;
            });
          }

          vm.changeAutoCompleteMeioPag = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.descricao)) {
                rowEdit.meio_pag = rowSelect.descricao;
                rowEdit.id_meio_pag = rowSelect.id_meio_pag;
              }
            } else {
              rowEdit.meio_pag = '';
              rowEdit.id_meio_pag = null;
            }
          }
          vm.novo = function () {
            var dt = new Date();
            var prm = {
              id_caixa:vm.data.rowParent.id_caixa,
              data_rec:dt,
              status:1,
              valor:0,
            }
            return vm.cadastro('create',prm);
          }

          vm.alterar = function (row) {
            return vm.cadastro('update',row);
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
              templateUrl: 'app/sistema/automacao/caixa/recebimentos/templates/rec-cad.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            return vm.data.showModal(config).then(function (result) {
              return result;
            });
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

          vm.startFoco = function () {
            // função para iniciar o foco do autocomplete na template select
            var focus = function () {
              document.getElementById('meiopag').focus();
            }
            setTimeout(focus,500);
          }

          vm.setSumQry = function (prm) {
            vm.sumQry = prm;
            vm.filtrar();
          }

        }
    }
})();

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
            var data = {id_meio_pag:null};
            vm.data.novo(data,'layout.pgconfig.meiopag.meiopagCad');
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.pgconfig.meiopag.meiopagCad');
          }

         vm.selectMeioPag = function ($event,element) {
            var config = {
              templateUrl: 'app/sistema/automacao/configuracao/meiopag/templates/meiopag-select.html',
              size:'',
              data:vm,
              backdrop:true,
              fullscreen:false,
              modal:{},
            };
            return vm.data.showModal(config,element).then(function (result) {
              return result;
            });
          }
          vm.startFoco = function () {
            // função para iniciar o foco do autocomplete na template select
            var focus = function () {
              document.getElementById('autocompleteMeiopag').focus();
            }
            setTimeout(focus,500);
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


        }
    }
})();

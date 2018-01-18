(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('TabPrazosMeioPagFuncService', TabPrazosMeioPagFuncService);

    TabPrazosMeioPagFuncService.$inject = [
      'UtilsFunctions','TabelaDataSet','UtilsDataFunctionService','FiltroService','MeioPagFuncService',
      '$state','$mdDialog','$filter','logger'
    ];

    /* @ngInject */
    function TabPrazosMeioPagFuncService(
      UtilsFunctions,TabelaDataSet,UtilsDataFunctionService,FiltroService,MeioPagFuncService,
      $state,$mdDialog,$filter,logger
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSet = new TabelaDataSet.tabPrazosMeioPag();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSet);
          vm.meiopag = new MeioPagFuncService.funcoes();
          var masterData = null;
          vm.data.title = "Meios de pagamento da tabela";

          vm.start = function (masterClass) {
            vm.setMasterData(masterClass.data.row);
            vm.activate();
          }

          vm.activate = function () {
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionDinamic = vm.filtroAutoComplete;//função que aciona o auto complete do filtro
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.data.setTable({alterar:null});
            vm.data.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.data.filtros.functionRead();//chama a consulta
          }

          vm.setMasterData = function (row) {
            masterData = row;
          }

          vm.filtrar = function () {
            var query = '';
            if (isset(masterData)) {
              if (isset(masterData.id_tp)) {
                query += ' and tpmp.id_tp = '+masterData.id_tp;
              } else {
                query += ' and tpmp.id_tp = 0';
              }
            }
            if (isset(vm.data.filtros.mainField)) {
              query += " and mp.descricao LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,false);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and mp.descricao LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.informarMeioPag = function (ev,el) {
            vm.meiopag.selectMeioPag(ev,el).then(function (row) {
              if (row) {
                vm.addMeioPag(row);
                //limpar o meio escolhido, para o proximo.
                vm.meiopag.data.row = null;
              }
            });
          }

          vm.addMeioPag = function (row) {
            var existe = $filter('filter')(vm.data.rows,{id_meio_pag:row.id_meio_pag},true);
            if (existe.length == 0) {
              var newMeioPg = {
                id_meio_pag : row.id_meio_pag,
                meio_pag    : row.descricao,
              }
              vm.data.setForengKey(masterData.id_tp,0);//setar o id mestre
              vm.data.novo(newMeioPg);
              vm.data.salvar();
            }
          }



        }
    }
})();

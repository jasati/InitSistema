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

          vm.activate = function () {
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionDinamic = vm.filtroAutoComplete;//função que aciona o auto complete do filtro
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.data.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.data.filtros.functionRead();//chama a consulta
          }

          vm.setMasterData = function (row) {
            masterData = row;
          }

          vm.setForengKey = function (id) {
            dataSet.valueForeignKey.push(id);
          }
          vm.filtrar = function () {
            if (isset(masterData)) {
              var query = ' and tpmp.id_tp = '+masterData.id_tp;
              if (isset(vm.data.filtros.mainField)) {
                query += " and mp.descricao LIKE '"+vm.data.filtros.mainField+"%'";
              }
              vm.data.read(query,false);//limitar os registro
            } else {
              logger.warning('Atenção! o masterData não foi definido.');
            }
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and mp.descricao LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.addItens = function (itens) {
            for (var i = 0; i < itens.length; i++) {
              vm.data.adicionar(itens[i]);
            }
          }


        }
    }
})();

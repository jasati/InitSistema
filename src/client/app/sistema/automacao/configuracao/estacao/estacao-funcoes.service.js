(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('EstacaoFuncService', EstacaoFuncService);

    EstacaoFuncService.$inject = [
      'UtilsFunctions','EstacaoDataSet','UtilsDataFunctionService','FiltroService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function EstacaoFuncService(
      UtilsFunctions,EstacaoDataSet,UtilsDataFunctionService,FiltroService,
      $state,$mdDialog,$filter
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSet = new EstacaoDataSet.estacao();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSet);
          vm.data.title = "Estações de PDV";
          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Nova estação',
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
            var query = ' and e.id_filial = '+vm.data.empresa.filial.id_filial;

            if (isset(vm.data.filtros.mainField)) {
              query += " and e.descricao LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and e.id_filial = "+vm.data.empresa.filial.id_filial;
            query += " and e.status = 1 and e.descricao LIKE '"+prm+"%'";
            return vm.data.load(query,false).then(function (result) {
              return result.reg;
            });
          }

          vm.novo = function () {
            var data = {id_estacao:null,id_filial:vm.data.userLogado.id_filial,status:1};
            vm.data.novo(data,'layout.pgconfig.estacoes.estacaoCad');
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.pgconfig.estacoes.estacaoCad');
          }

         vm.selectEstacoes = function (element) {
            var config = {
              templateUrl: 'app/sistema/automacao/configuracao/estacao/templates/estacao-select.html',
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
              document.getElementById('autocomplete').focus();
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

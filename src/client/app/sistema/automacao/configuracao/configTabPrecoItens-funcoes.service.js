(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('ConfigTabPrecoItensFuncService', ConfigTabPrecoItensFuncService);

    ConfigTabPrecoItensFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function ConfigTabPrecoItensFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes(idClassTable) {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = AutomacaoDataset.tabelaItensPreco();
          vm.tabela_itens = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.divider = 'botton';
          vm.title = 'Configurações';

          vm.filtrar = function () {
            var query = '';
            if (isset(idClassTable)) {
              query += ' and id_tabela_preco = '+idClassTable;
            }
            if (isset(vm.tabela_itens.filtros.mainField)) {
              query += " and descricao LIKE '%"+vm.tabela_itens.filtros.mainField+"%'";
            }
            vm.tabela_itens.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm,idClass,id) {
            var query = "";
            if (isset(prm)) {
              query += " and descricao LIKE '%"+prm+"%'";
            }
            if (isset(idClass)) {
              query += ' and id_tabela_preco = '+idClass;
            }
            if (isset(id)) {
              query += ' and id_item_preco = '+id;
            }
            return vm.tabela_itens.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.deletar = function (ev,data) {
            vm.tabela_itens.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.tabela_itens.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }
          vm.startFiltro = function () {
            // função para instanciar o modulo de filtros
            // so deve ser chamado uma vez apos criado
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.tabela_itens.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.tabela_itens.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.tabela_itens.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.tabela_itens.filtros.functionRead();//chama a consulta
          }          

        }
    }
})();

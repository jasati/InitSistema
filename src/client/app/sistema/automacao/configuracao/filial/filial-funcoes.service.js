(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('FilialFuncService', FilialFuncService);

    FilialFuncService.$inject = [
      'UtilsFunctions','FilialDataSet','UtilsDataFunctionService','PessoaFuncService','FiltroService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function FilialFuncService(
      UtilsFunctions,FilialDataSet,UtilsDataFunctionService,PessoaFuncService,FiltroService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = FilialDataSet.filial();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.pessoaFunc = new PessoaFuncService.funcoes();
          vm.data.title = 'Filiais';

          vm.activate = function () {
            var funcFiltros = new FiltroService.funcoes();
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Nova Filial',
            };
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
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
              query += " and CONCAT(p.nome_comp,p.nome_red) LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm,id) {
            var query = "";
            if (isset(prm)) {
              query += " and CONCAT(p.nome_comp,p.nome_red) LIKE '"+prm+"%'";
            }
            if (isset(id)) {
              query += " and v.id_pessoa = "+id;
            }
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }



          vm.novo = function (data) {
            var prm = {tipo:0};
            vm.data.novo(prm,'layout.vendedores.cadastro');
            vm.pessoaFunc.pessoa.novo(prm);
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.vendedores.cadastro');
            vm.pessoaFunc.load(row.id_pessoa);
          }

          vm.salvar = function () {
            vm.pessoaFunc.pessoa.salvar().then(function (result) {
              if (!isset(vm.data.row.id_pessoa)) {
                vm.data.row.id_pessoa = vm.pessoaFunc.pessoa.row.id_pessoa;
              }
              vm.data.salvar();
            });
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.novo(row);
                break;
              case 'update':
                vm.alterar(row);
                break;
              default:
            }
          }

          vm.deletar = function (ev,data) {
            vm.data.confirmDel(ev,data.nome_comp).then(function (result) {
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

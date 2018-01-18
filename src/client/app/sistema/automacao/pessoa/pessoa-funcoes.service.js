(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('PessoaFuncService', PessoaFuncService);

    PessoaFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService',
      '$state','$mdDialog','$filter','$rootScope','$stateParams'
    ];

    /* @ngInject */
    function PessoaFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,
      $state,$mdDialog,$filter,$rootScope,$stateParams
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = AutomacaoDataset.pessoa();
          vm.pessoa = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.divider = 'botton';
          vm.title = 'Pessoas';

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.pessoa.filtros.mainField)) {
              query += " and CONCAT(p.nome_comp,p.nome_red) LIKE '%"+vm.pessoa.filtros.mainField+"%'";
            }
            vm.pessoa.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm,id,orderBy) {
            var query = "";
            if (isset(prm)) {
              query = " and CONCAT(p.nome_comp,p.nome_red) LIKE '%"+prm+"%'";
            }
            if (isset(id)) {
              query += " and p.id_pessoa = "+id;
            }
            if (isset(orderBy)) {
              dataSetProvider.orderBy = orderBy;
            } else {
              dataSetProvider.orderBy = '';
            }
            return vm.pessoa.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.novo = function () {
            vm.cadastro('create',{id_pessoa:null})
          }

          vm.alterar = function (row) {
            vm.cadastro('update',row);
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.pessoa.novo(row);
                break;
              case 'update':
                vm.pessoa.alterar(row);
                break;
              default:
            }

            var config = {
              templateUrl: 'app/sistema/automacao/pessoa/templates/pessoa-cad.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            vm.pessoa.showModal(config);
          }

          vm.load = function (id) {
            if (isset(id)) {
              var filtro =' and p.id_pessoa = '+id;
              vm.pessoa.read(filtro,true).then(function (result) {
                if (result.qtde>0) {
                  vm.pessoa.alterar(result.reg[0]);
                }
              });
            }
          }

          vm.deletar = function (ev,data) {
            vm.pessoa.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.pessoa.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.deleteAll = function (ev) {
            for (var i = 0; i < vm.pessoa.rowsSelected.length; i++) {
              vm.pessoa.remover(vm.pessoa.rowsSelected[i]);
            }
            vm.pessoa.confirmDel(ev,'Todos os registros selecionados').then(function (result) {
              if (result) {
                vm.pessoa.aplyUpdates(/*atualizar apos a alterao*/true).then(function (result) {
                  if (result) {
                    vm.pessoa.rowsSelected = [];
                  }
                });
              }
            });
          }

          vm.setToolbar = function () {
            vm.toolbarFunc = {
              toolbarModelo : '1',//com botao novo
              mediaxs       : vm.pessoa.mediaxs,
              btAddNovo     : vm.novo,
              btAddTootip   : 'Nova pessoa',
              title         : vm.title,
              filtros       : vm.pessoa.filtros,
              report        : '',
            };
          }

          vm.setTable = function () {
            vm.table = {
              responsive:true,
              dados     :vm.pessoa,
              colunas   :dataSetProvider.tableCols,
              id        :dataSetProvider.id_tabela,
              alterar   :vm.alterar,
              deleteAll :vm.deleteAll,
            }
          }
          vm.setPagination = function () {
            vm.pagination = {
              dados     :vm.pessoa,
              filtrar   :vm.filtrar,
            }
          }

          vm.state = function () {
            return $state.current.component;
          }

        }
    }
})();

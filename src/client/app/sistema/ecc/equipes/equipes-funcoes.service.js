(function() {
    'use strict';

    angular
        .module('app.ecc')
        .service('EquipeFuncService', EquipeFuncService);

    EquipeFuncService.$inject = [
      'UtilsFunctions','EccDataset','UtilsDataFunctionService','FiltroService','EquipeCasaisFuncService',
      '$mdDialog','$filter','$uibModal'
    ];

    /* @ngInject */
    function EquipeFuncService(
      UtilsFunctions,EccDataset,UtilsDataFunctionService,FiltroService,EquipeCasaisFuncService,
      $mdDialog,$filter,$uibModal
    ) {
        this.funcoes = funcoes;

        function funcoes(idEncontro) {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = EccDataset.equipes(idEncontro);

          vm.equipe = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.equipeCasais = new EquipeCasaisFuncService.funcoes(idEncontro);
          vm.divider = 'botton';
          vm.title = 'Equipes';

          vm.filtrar = function () {
            var query = ' and ee.id_encontro = '+idEncontro;

            if (isset(vm.equipe.filtros.mainField)) {
              query += " and ee.descricao LIKE '%"+vm.equipe.filtros.mainField+"%'";
            }
            vm.equipe.read(query);
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                var confirm = $mdDialog.prompt()
                  .title('Adicionar nova equipe')
                  .placeholder('Descrição da equipe')
                  .ariaLabel('Equipe')
                  .targetEvent(ev)
                  .ok('salvar')
                  .cancel('cancelar');

                $mdDialog.show(confirm).then(function(result) {
                  if (isset(result)) {
                    var equipe = {
                      id_encontro:idEncontro,
                      descricao:result,
                    };
                    vm.equipe.novo(equipe);
                    vm.equipe.salvar().then(function (result) {
                      if (result) {
                        vm.equipe.rows.push(vm.equipe.row);
                      }
                    });
                  }
                },function (result) {
                  console.log('cancelou');
                });
                break;
              case 'update':
                var confirm = $mdDialog.prompt()
                  .title('Alterar Equipe')
                  .placeholder('Descrição da equipe')
                  .ariaLabel('Equipe')
                  .initialValue(row.descricao)
                  .targetEvent(ev)
                  .ok('salvar')
                  .cancel('cancelar');

                $mdDialog.show(confirm).then(function(result) {
                  if (isset(result)) {
                    row.descricao=result;
                    vm.equipe.alterar(data);
                    vm.equipe.salvar();
                  }
                },function (result) {
                  console.log('cancelou');
                });
                break;
              default:
            }
          }

          vm.deletar = function (ev,data) {
            vm.equipe.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.equipe.deletar([data]).then(function (deletado) {
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
            funcFiltros.filtros.fields = vm.equipe.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.equipe.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.equipe.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.equipe.filtros.functionRead();//chama a consulta
            vm.equipeCasais.startFiltro();
          }

        }
    }
})();

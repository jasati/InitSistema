(function() {
    'use strict';

    angular
        .module('app.ecc')
        .service('EquipeCasaisFuncService', EquipeCasaisFuncService);

    EquipeCasaisFuncService.$inject = [
      'UtilsFunctions','EccDataset','UtilsDataFunctionService','FiltroService',
      '$mdDialog','$filter','$uibModal'
    ];

    /* @ngInject */
    function EquipeCasaisFuncService(
      UtilsFunctions,EccDataset,UtilsDataFunctionService,FiltroService,
      $mdDialog,$filter,$uibModal
    ) {
        this.funcoes = funcoes;

        function funcoes(idEncontro,idEquipe) {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = EccDataset.equipesCasais(idEncontro);

          vm.equipeCasais = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.divider = 'botton';
          vm.title = 'Equipes';

          vm.filtrar = function (filtroEquipe) {
            var query = ' and e.id_encontro = '+idEncontro;
            if (filtroEquipe) {
              query += "  and eq.id_enc_eq = "+filtroEquipe;
            }

            if (isset(vm.equipeCasais.filtros.mainField)) {
              query += " and e.descricao LIKE '%"+vm.equipeCasais.filtros.mainField+"%'";
            }
            vm.equipeCasais.read(query);
          }

          vm.cadastro = function (action,row,ev) {

          }

          vm.deletar = function (ev,data) {
            vm.equipeCasais.confirmDel(ev,data.casal).then(function (result) {
              if (result) {
                vm.equipeCasais.deletar([data]).then(function (deletado) {
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
            funcFiltros.filtros.fields = vm.equipeCasais.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.equipeCasais.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.equipeCasais.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.equipeCasais.filtros.functionRead();//chama a consulta
          }

        }
    }
})();

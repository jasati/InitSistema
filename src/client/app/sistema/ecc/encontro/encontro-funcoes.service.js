(function() {
    'use strict';

    angular
        .module('app.ecc')
        .service('EncontroFuncService', EncontroFuncService);

    EncontroFuncService.$inject = [
      'UtilsFunctions','EccDataset','UtilsDataFunctionService',
      'EncontreirosFuncService','EncontristaFuncService','EquipeFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function EncontroFuncService(
      UtilsFunctions,EccDataset,UtilsDataFunctionService,
      EncontreirosFuncService,EncontristaFuncService,EquipeFuncService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = EccDataset.encontro();
          vm.encontro = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.divider = 'botton';
          vm.title = 'Encontro';

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.encontro.filtros.mainField)) {
              query += " and descricao LIKE '%"+vm.encontro.filtros.mainField+"%'";
            }
            vm.encontro.read(query);
          }

          vm.showEncontro = function (row) {
            vm.encontro.alterar(row);
            var state = {
              child:true,
              hide:true,
              state:'layout.ecc.detal',
            }
            vm.encontro.showState(state);
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.encontro.novo(row);
                break;
              case 'update':
                vm.encontro.alterar(row);
                break;
              default:
            }

            var config = {
              templateUrl: 'app/sistema/ecc/encontro/templates/encontro-cad.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            vm.encontro.showModal(config);
          }

          vm.deletar = function (ev,data) {
            vm.encontro.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.encontro.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.goToEncontreiros = function (id) {
            if (!isset(vm.encontreiros)) {
              vm.encontreiros = new EncontreirosFuncService.funcoes(vm.encontro);
            }
            vm.encontreiros.startFiltro();
          }
          vm.goToEncontristas = function (id) {
            if (!isset(vm.encontrista)) {
              vm.encontrista = new EncontristaFuncService.funcoes(id);
            }
            vm.encontrista.startFiltro();
          }
          vm.goToEquipes = function (id) {
            if (!isset(vm.equipe)) {
              vm.equipe = new EquipeFuncService.funcoes(id);
            }
            vm.equipe.startFiltro();
          }
        }
    }
})();

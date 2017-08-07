(function() {
    'use strict';

    angular
        .module('app.ecc')
        .service('EncontroFuncService', EncontroFuncService);

    EncontroFuncService.$inject = [
      'UtilsFunctions','EccDataset','UtilsDataFunctionService',
      '$mdDialog','$filter'
    ];

    /* @ngInject */
    function EncontroFuncService(
      UtilsFunctions,EccDataset,UtilsDataFunctionService,
      $mdDialog,$filter
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
              position :'center',
              event:ev,
              data:vm,
              hasBackdrop:false,
              escapeToClose:true,
              fullscreen:false,
            };
            vm.encontro.showPainel(config);
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

        }
    }
})();

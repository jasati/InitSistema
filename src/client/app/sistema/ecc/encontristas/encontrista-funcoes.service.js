(function() {
    'use strict';

    angular
        .module('app.ecc')
        .service('EncontristaFuncService', EncontristaFuncService);

    EncontristaFuncService.$inject = [
      'UtilsFunctions','EccDataset','UtilsDataFunctionService','FiltroService','CasaisFuncService',
      '$mdDialog','$filter','$uibModal'
    ];

    /* @ngInject */
    function EncontristaFuncService(
      UtilsFunctions,EccDataset,UtilsDataFunctionService,FiltroService,CasaisFuncService,
      $mdDialog,$filter,$uibModal
    ) {
        this.funcoes = funcoes;

        function funcoes(idEncontro,idEncontreiro) {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = EccDataset.encontristas(idEncontro,idEncontreiro);

          vm.encontrista = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.divider = 'botton';
          vm.title = 'Encontrista';
          vm.crud = false;//exibir no view as opçoes de criar atualizar e deletar

          vm.filtrar = function () {
            var query = ' and ci.id_encontro = '+idEncontro;
            if (isset(idEncontreiro)) {
              var query = ' and ci.id_enc_eiro = '+idEncontreiro;
            }
            if (isset(vm.encontrista.filtros.mainField)) {
              query += " and CONCAT(c.marido,c.esposa) LIKE '%"+vm.encontrista.filtros.mainField+"%'";
            }
            vm.encontrista.read(query);
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.encontrista.novo(row);
                break;
              case 'update':
                vm.encontrista.alterar(row);
                break;
              default:
            }
            var config = {
              templateUrl: 'app/sistema/ecc/encontreiro/templates/encontreiro-tab.html',
              ariaLabelledBy: 'encontrista',
              ariaDescribedBy: 'encontrista-modal',
              size:'',
              data:vm,
              backdrop:true,
              fullscreen:false,
              modal:{},
            };
            return vm.encontrista.showModal(config).then(function (data) {
              return data
            });
          }

          vm.deletar = function (ev,data) {
            vm.encontrista.confirmDel(ev,data.casal).then(function (result) {
              if (result) {
                vm.encontrista.deletar([data]).then(function (deletado) {
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
            funcFiltros.filtros.fields = vm.encontrista.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.encontrista.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.encontrista.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.encontrista.filtros.functionRead();//chama a consulta
          }

          vm.showCasais = function () {
            vm.casal = new CasaisFuncService.funcoes(idEncontro);
            var prm = ' and c.id_casal not in (select ei.id_casal from enc_encontrista ei where ei.id_encontro = '+idEncontro+') and c.situacao = 0';
            vm.casal.startFiltro(prm);
            vm.casal.selected = true;
            vm.casal.cadastro('select',{situacao:0},'.modal').then(function (data) {
              if (data) {
                for (var i = 0; i < data.length; i++) {
                  data[i].status = 1;//marcar como pago
                  vm.encontrista.adicionar(data[i]);
                }
                vm.encontrista.aplyUpdates(false);
                vm.filtrar();
              }
            });
          }

          vm.reservaFicha = function () {
            var data = {
              status:0,
            }
            vm.encontrista.adicionar(data);
            vm.encontrista.aplyUpdates();
          }

        }
    }
})();

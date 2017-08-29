(function() {
    'use strict';

    angular
        .module('app.ecc')
        .service('EncontreirosFuncService', EncontreirosFuncService);

    EncontreirosFuncService.$inject = [
      'UtilsFunctions','EccDataset','UtilsDataFunctionService','FiltroService','CasaisFuncService','EncontristaFuncService',
      '$mdDialog','$filter'
    ];

    /* @ngInject */
    function EncontreirosFuncService(
      UtilsFunctions,EccDataset,UtilsDataFunctionService,FiltroService,CasaisFuncService,EncontristaFuncService,
      $mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes(idEncontro) {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = EccDataset.encontreiros(idEncontro);

          vm.encontreiros = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.divider = 'botton';
          vm.title = 'Encontreiro';

          vm.filtrar = function () {
            var query = ' and ce.id_encontro = '+idEncontro;
            if (isset(vm.encontreiros.filtros.mainField)) {
              query += " and CONCAT(c.marido,c.esposa) LIKE '%"+vm.encontreiros.filtros.mainField+"%'";
            }
            if (isset(vm.encontreiros.filtroExterno)) {
              query += vm.encontreiros.filtroExterno;
            }
            vm.encontreiros.read(query,true);//limitar os registros
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.encontreiros.novo(row);
                break;
              case 'update':
                vm.encontreiros.alterar(row);
                break;
              default:
            }
            vm.encontrista = new EncontristaFuncService.funcoes(idEncontro,row.id_enc_eiro);
            vm.encontrista.crud = true;//habilitar as opçoes de criar atualizar e deletar
            vm.encontrista.startFiltro();
            var config = {
              templateUrl: 'app/sistema/ecc/encontreiro/templates/encontreiro-tab.html',
              ariaLabelledBy: 'encontreiro',
              ariaDescribedBy: 'encontreiro-modal',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            return vm.encontreiros.showModal(config).then(function (data) {
              return data
            });
          }

          vm.showSelectEncontreiro = function () {
            var config = {
              templateUrl: 'app/sistema/ecc/encontreiro/templates/encontreiro-select.html',
              ariaLabelledBy: 'encontreiro',
              ariaDescribedBy: 'encontreiro-modal',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            return vm.encontreiros.showModal(config).then(function (data) {
              return data
            });
          }

          vm.deletar = function (ev,data) {
            vm.encontreiros.confirmDel(ev,data.casal).then(function (result) {
              if (result) {
                vm.encontreiros.deletar([data]).then(function (deletado) {
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
            funcFiltros.filtros.fields = vm.encontreiros.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.encontreiros.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.encontreiros.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.encontreiros.filtros.functionRead();//chama a consulta
          }

          vm.showCasais = function (ev) {
            vm.casal = new CasaisFuncService.funcoes();
            var prm = ' and c.id_casal not in (select ee.id_casal from enc_encontreiro ee where ee.id_encontro = '+idEncontro+') and (c.id_encontro <> '+idEncontro+' or c.id_encontro is null)';
            vm.casal.filtroExterno = prm;
            vm.casal.startFiltro();
            vm.casal.selected = true;
            vm.casal.cadastro('select').then(function (data) {
              if (data) {
                for (var i = 0; i < data.length; i++) {
                  vm.encontreiros.adicionar(data[i]);
                }
                vm.encontreiros.aplyUpdates(true);//true para recarregar os registros
                //atualizar a situação dos casais para 1
                var casais = UtilsFunctions.copiarObjecto(data);
                for (var i = 0; i < data.length; i++) {
                  //remover o campo id_encontro para nao alterar o encontro original
                  data[i] = UtilsFunctions.removeCamposInvalidos(data[i],['id_encontro']);
                  data[i].situacao = 1;
                  data[i].action = 'u';
                }
                vm.casal.casal.aplyUpdates();
              }
            });
          }

        }
    }
})();

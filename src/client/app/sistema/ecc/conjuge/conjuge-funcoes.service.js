(function() {
    'use strict';

    angular
        .module('app.ecc')
        .service('ConjugeFuncService', ConjugeFuncService);

    ConjugeFuncService.$inject = [
      'UtilsFunctions','EccDataset','UtilsDataFunctionService','FiltroService','$uibModal','$document',
      '$mdDialog','$filter'
    ];

    /* @ngInject */
    function ConjugeFuncService(
      UtilsFunctions,EccDataset,UtilsDataFunctionService,FiltroService,$uibModal,$document,
      $mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var isNumber = UtilsFunctions.isNumber;
          var dataSetProvider = EccDataset.conjuge();
          vm.conjuge = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.divider = 'botton';
          vm.title = 'Conjuge';
          vm.filtroExterno = '';
          vm.selected = false;//exibir o botão no form de cadastro que foi chamado pela tabela de selecionados

          vm.filtrar = function (filtro) {
            var query = '';
            if (!isNumber(filtro)) {
              query = filtro?filtro:'';
            }
            if (isset(vm.conjuge.filtros.mainField)) {
              query += " and nome_comp LIKE '%"+vm.conjuge.filtros.mainField+"%'";
            }
            if (isset(vm.filtroExterno)) {
              query += vm.filtroExterno;
            }
            vm.conjuge.read(query,true);
          }

          vm.novoConjuge = function (data) {
            vm.conjuge.novo(data);
          }

          vm.cadastro = function (action,row,parent) {
            switch (action) {
              case 'create':
                vm.novoConjuge(row);
                break;
              case 'update':
                vm.conjuge.alterar(row);
                break;
              default:vm.conjuge.select();
            }
            var config = {
              templateUrl: 'app/sistema/ecc/conjuge/templates/conjuge-cad.html',
              ariaLabelledBy: 'conjuge',
              ariaDescribedBy: 'conjuge-modal',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            return vm.conjuge.showModal(config,parent).then(function (data) {
              return data
            });
          }

          vm.loadConjuge = function (id) {
            if (isset(id)) {
              var filtro =' and id_conjuge = '+id;
              vm.conjuge.read(filtro,true).then(function (result) {
                if (result.qtde>0) {
                  vm.conjuge.alterar(result.reg[0]);
                }
              });
            }
          }

          vm.deletar = function (ev,data) {
            vm.conjuge.confirmDel(ev,data.conjuge).then(function (result) {
              if (result) {
                vm.conjuge.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.startFiltro = function (prm) {
            // função para instanciar o modulo de filtros
            // so deve ser chamado uma vez apos criado
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.conjuge.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.conjuge.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.conjuge.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.conjuge.filtros.functionRead(prm);//chama a consulta
          }

        }
    }
})();

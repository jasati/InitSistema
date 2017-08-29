(function() {
    'use strict';

    angular
        .module('app.ecc')
        .service('CasaisFuncService', CasaisFuncService);

    CasaisFuncService.$inject = [
      'UtilsFunctions','EccDataset','UtilsDataFunctionService','FiltroService','$uibModal','$document',
      '$mdDialog','$filter'
    ];

    /* @ngInject */
    function CasaisFuncService(
      UtilsFunctions,EccDataset,UtilsDataFunctionService,FiltroService,$uibModal,$document,
      $mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes(idEncontro) {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var isNumber = UtilsFunctions.isNumber;
          var dataSetProvider = EccDataset.casal();
          var usuario = dataSetProvider.provider.getSessaoUsuario();
          dataSetProvider.valueForeignKey.push(usuario.id_usuario);
          vm.casal = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.divider = 'botton';
          vm.title = 'casal';
          vm.filtroExterno = '';
          vm.selected = false;//exibir o botão no form de cadastro que foi chamado pela tabela de selecionados

          vm.filtrar = function (filtro) {
            var query = '';
            if (!isNumber(filtro)) {
              query = filtro?filtro:'';
            }
            if (isset(vm.casal.filtros.mainField)) {
              query += " and CONCAT(marido,esposa) LIKE '%"+vm.casal.filtros.mainField+"%'";
            }
            if (isset(vm.filtroExterno)) {
              query += vm.filtroExterno;
            }
            vm.casal.read(query,true);
          }

          vm.novoCasal = function (data) {
            if (isset(idEncontro)) {
              data.id_encontro = idEncontro;
            }
            vm.casal.novo(data);
          }

          vm.cadastro = function (action,row,parent) {
            switch (action) {
              case 'create':
                vm.novoCasal(row);
                break;
              case 'update':
                vm.casal.alterar(row);
                break;
              default:vm.casal.select();
            }
            var config = {
              templateUrl: 'app/sistema/ecc/casais/templates/casal-painel.html',
              ariaLabelledBy: 'casal',
              ariaDescribedBy: 'casal-modal',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            return vm.casal.showModal(config,parent).then(function (data) {
              return data
            });
          }

          vm.deletar = function (ev,data) {
            vm.casal.confirmDel(ev,data.casal).then(function (result) {
              if (result) {
                vm.casal.deletar([data]).then(function (deletado) {
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
            funcFiltros.filtros.fields = vm.casal.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.casal.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.casal.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.casal.filtros.functionRead(prm);//chama a consulta
          }

        }
    }
})();

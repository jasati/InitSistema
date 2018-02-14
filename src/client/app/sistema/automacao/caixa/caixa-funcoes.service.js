(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('CaixaFuncService', CaixaFuncService);

    CaixaFuncService.$inject = [
      'UtilsFunctions','CaixaDataSet','UtilsDataFunctionService','FiltroService','RecFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function CaixaFuncService(
      UtilsFunctions,CaixaDataSet,UtilsDataFunctionService,FiltroService,RecFuncService,
      $state,$mdDialog,$filter
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          vm.soma = UtilsFunctions.soma;
          var dataSet = new CaixaDataSet.caixa();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSet);
          vm.data.title = "Caixa";
          vm.tabview = 0;
          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Novo Caixa',
            };
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionDinamic = vm.filtroAutoComplete;//função que aciona o auto complete do filtro
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
              query += " and pdv.descricao LIKE '"+vm.data.filtros.mainField+"%'";
            }
            if (isset(vm.data.rowParent)) {
              if (isset(vm.data.rowParent.id_usuario)) {
                query += " and c.id_usuario = "+vm.data.rowParent.id_usuario;
              }
              if (isset(vm.data.rowParent.id_pdv)) {
                query += " and c.id_pdv = "+vm.data.rowParent.id_pdv;
              }
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and pdv.descricao LIKE '"+prm+"%'";
            return vm.data.load(query,false).then(function (result) {
              return result.reg;
            });
          }

          vm.novo = function (row) {
            vm.data.setNewChilder(RecFuncService,row,false);
            return vm.cadastro('create',row);
          }

          vm.alterar = function (row) {
            vm.data.setNewChilder(RecFuncService,row,true);
            return vm.cadastro('update',row);
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.data.novo(row);
                break;
              case 'update':
                vm.data.alterar(row);
                break;
              default:
            }

            var config = {
              templateUrl: 'app/sistema/automacao/caixa/templates/caixa-cad.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              keyboard:false,
              modal:{},
            };
            return vm.data.showModal(config).then(function (result) {
              return result;
            });
          }


          vm.deletar = function (ev,data) {
            vm.data.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.data.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.startFoco = function () {
            // função para iniciar o foco do autocomplete na template select
            var focus = function () {
              document.getElementById('suprimento').focus();
              document.getElementById('suprimento').select();
            }
            setTimeout(focus,500);
          }

          vm.loadCaixa = function () {
            var query = " and c.id_estacao = "+vm.data.rowParent.id_estacao+" and c.id_usuario = "+vm.data.userLogado.id_usuario;
            return vm.data.load(query,'LAST').then(function (result) {
              if (result.reg.length > 0) {
                vm.data.alterar(result.reg[0]);
                vm.data.setNewChilder(RecFuncService,result.reg[0],false);
                return  result.reg[0];
              } else {
                return vm.abrirCaixa();
              }
            });
          }

          vm.abrirCaixa = function () {
            var dt = new Date();
            var prm = {
              id_caixa:null,
              id_usuario:vm.data.userLogado.id_usuario,
              id_filial:vm.data.userLogado.id_filial,
              id_estacao:vm.data.rowParent.id_estacao,
              data_ini:dt,
              status:'A',
              desc_status:'ABERTO',
              operador:vm.data.userLogado.nome,
              estacao:vm.data.rowParent.descricao,
              filial:vm.data.userLogado.filial,
              suprimento:0.00,
            }
            return vm.novo(prm);
          }

          vm.fecharCaixa = function () {
            var dt = new Date();
            vm.data.row.status = 'F';
            vm.data.row.data_fim = dt;
            vm.data.row.action = 'u';
          }
          vm.cancelarFechamento = function () {
            vm.data.row.status = 'A';
            vm.data.row.data_fim = null;
            vm.data.row.action = undefined;
          }
        }
    }
})();

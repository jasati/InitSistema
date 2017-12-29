(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('TabPrazosFuncService', TabPrazosFuncService);

    TabPrazosFuncService.$inject = [
      'UtilsFunctions','TabelaDataSet','UtilsDataFunctionService','FiltroService',
      '$state','$mdDialog','$filter','logger','$interval'
    ];

    /* @ngInject */
    function TabPrazosFuncService(
      UtilsFunctions,TabelaDataSet,UtilsDataFunctionService,FiltroService,
      $state,$mdDialog,$filter,logger,$interval
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSet = new TabelaDataSet.tabelaPrazos();
          var dataSetCreateTabItens = TabelaDataSet.createTabPrecoItens();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSet);
          vm.createTabItens = new UtilsDataFunctionService.dataFuncoes(dataSetCreateTabItens);
          var masterData = null;
          vm.data.title = "Prazos da tabela";

          vm.activate = function () {
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionDinamic = vm.filtroAutoComplete;//função que aciona o auto complete do filtro
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.data.setTable({alterar:vm.alterar});
            vm.data.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.data.filtros.functionRead();//chama a consulta
            vm.setCriandoTabela();
          }

          vm.setMasterData = function (row) {
            masterData = row;
          }

          vm.setForengKey = function (id) {
            dataSet.valueForeignKey.push(id);
          }
          vm.filtrar = function () {
            if (isset(masterData)) {
              var query = ' and tp.id_tabela = '+masterData.id_tabela;
              if (isset(vm.data.filtros.mainField)) {
                query += " and tp.descricao LIKE '"+vm.data.filtros.mainField+"%'";
              }
              vm.data.read(query,false);//limitar os registro
            } else {
              logger.warning('Atenção! o masterData não foi definido.');
            }
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and tp.descricao LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.novo = function () {
            vm.cadastro('create',{id_tabela:masterData.id_tabela})
          }

          vm.alterar = function (row) {
            vm.cadastro('update',row);
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
              templateUrl: 'app/sistema/automacao/configuracao/tabela/templates/tabela-prazos-cadastro.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            vm.data.showModal(config);
          }

          vm.callCreateTableItens = function (row) {
            vm.setCriandoTabela();
            vm.criandotabela.start();
            vm.criandotabela.showInfo = true;
            var prm = dataSet.empresa.id_empresa+",";
            prm += row.id_tp+",";
            prm += row.percentual;
            vm.createTabItens.functionSql(prm).then(function (result) {
              vm.criandotabela.stop();
              if (!isset(result.status)) {
                vm.criandotabela.msg = 'Procedimento de inclusão da tabela nos itens foi concluida! Tabela aplicada em '+result.result+" itens.";
              } else {
                vm.criandotabela.msg = 'Ocorreu um erro no procedimento de inclusão da tabela nos itens. Detalhes : '+result.msg;
              }
;
            });
          }

          vm.setCriandoTabela = function () {
            vm.criandotabela = {
              status : false,
              msg : "A tabela está sendo adicionada em todos os itens cadastrado, esse procedimento poderá levar de 1 a 2 minutos!",
              showInfo : false,
              progress : 0,
              enginer : null,
              start : function () {
                vm.criandotabela.status = true;
                vm.criandotabela.enginer = $interval(function () {
                  vm.criandotabela.progress += 1;
                  if (vm.criandotabela.progress >= 100) {
                    vm.criandotabela.progress = 0;
                  }
                },100);
              },
              stop: function () {
                this.status = false;
                $interval.cancel(this.enginer);
              }
            }
          }


        }
    }
})();

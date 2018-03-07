(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('TabPrazosFuncService', TabPrazosFuncService);

    TabPrazosFuncService.$inject = [
      'UtilsFunctions','TabelaDataSet','UtilsDataFunctionService','FiltroService','TabPrazosMeioPagFuncService',
      '$state','$mdDialog','$filter','logger','$interval'
    ];

    /* @ngInject */
    function TabPrazosFuncService(
      UtilsFunctions,TabelaDataSet,UtilsDataFunctionService,FiltroService,TabPrazosMeioPagFuncService,
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
          vm.tabPrazosMp = new TabPrazosMeioPagFuncService.funcoes()
          vm.createTabItens = new UtilsDataFunctionService.dataFuncoes(dataSetCreateTabItens);
          var masterData = null;
          vm.data.title = "Tabelas";

          vm.start = function (masterClass) {
            vm.setMasterData(masterClass.data.row);
            vm.activate();
          }

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

          vm.filtrar = function () {
            var query = '';
            if (isset(masterData)) {
              if (isset(masterData.id_tabela)) {
                query += ' and tp.id_tabela = '+masterData.id_tabela;
              } else {
                query += ' and tp.id_tabela = 0';
              }
            }
            if (isset(vm.data.filtros.mainField)) {
              query += " and tp.descricao LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,false);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and tp.descricao LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.novo = function () {
            vm.data.setForengKey(masterData.id_tabela,0);
            vm.data.novo({},'layout.pgconfig.tabela.tabelaPrazCad');
            vm.tabPrazosMp.start(vm);
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.pgconfig.tabela.tabelaPrazCad');
            vm.tabPrazosMp.start(vm);
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

          vm.selectTabela = function (element) {
            var config = {
              templateUrl: 'app/sistema/automacao/configuracao/tabela/templates/tab-prazo-select.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            return vm.data.showModal(config,element).then(function (result) {
              return result;
            });
          }

          vm.startFoco = function () {
            // função para iniciar o foco do autocomplete na template select
            var focus = function () {
              document.getElementById('autocomplete').focus();
            }
            setTimeout(focus,500);
          }          


        }
    }
})();

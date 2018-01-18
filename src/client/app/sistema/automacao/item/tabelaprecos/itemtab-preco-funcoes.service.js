(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('ItemTabPrecoFuncService', ItemTabPrecoFuncService);

    ItemTabPrecoFuncService.$inject = [
      'UtilsFunctions','UtilsDataFunctionService','FiltroService','ItemTabPrecoDataSet','TabPrazosFuncService',
      '$state','$mdDialog','$filter','logger'
    ];

    /* @ngInject */
    function ItemTabPrecoFuncService(
      UtilsFunctions,UtilsDataFunctionService,FiltroService,ItemTabPrecoDataSet,TabPrazosFuncService,
      $state,$mdDialog,$filter,logger
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var onEnter = UtilsFunctions.handleEnter;
          var dataSetMaster = new ItemTabPrecoDataSet.dataSetMaster();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetMaster);
          vm.tabPrazo = new TabPrazosFuncService.funcoes();
          vm.data.title = "Tabela de Preços dos itens";
          var masterData = null;
          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Nova tabela de preço',
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
            if (isset(vm.data.rowParent)) {
              query = ' and itp.id_item = '+vm.data.rowParent.id_item;
            }
            if (isset(vm.data.filtros.mainField)) {
              query += " and CONCAT(t.descricao,' ',tp.descricao) LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and CONCAT(t.descricao,' ',tp.descricao) LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.calcLucro = function (row,tipo,custo) {
            if (tipo=="%") {
              row.valor = Number(((custo*row.perc_lucro/100)+custo).toFixed(2));
            } else {
              row.perc_lucro = Number(((row.valor-custo)/custo*100).toFixed(2));//calculo para descobrir o lucro
            }
          }

          vm.atualizarLucro = function () {
            //função para atualizar o lucro e o preço automaticamente, quando o usuario
            //acessa a janela e o custo esta alterado para cima, ideal quando inicia a template
            //com o ng-init
            for (var i = 0; i < vm.data.rows.length; i++) {
              vm.calcLucro(vm.data.rows[i],'%',vm.data.rowParent.custo);
            }
          }

          vm.showTabela = function (element) {
            var config = {
              templateUrl: 'app/sistema/automacao/item/tabelaprecos/templates/itemtab-preco-cad.html',
              size:'',
              data:vm,
              backdrop:true,
              fullscreen:false,
              modal:{},
            };
            return vm.data.showModal(config,element).then(function (result) {
              return result;
            })
          }

          vm.changeAutoComplete = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.descricao)) {
                rowEdit.id_tp          = rowSelect.id_tp;
                rowEdit.desc_tab_prazo = rowSelect.descricao;
                rowEdit.perc_lucro     = rowSelect.percentual;
                rowEdit.desc_tab_comp  = rowSelect.tabela+' '+rowSelect.descricao;
                rowEdit.tipo           = rowSelect.tipo;
                vm.calcLucro(rowEdit,'%',vm.data.rowParent.custo);
                document.getElementById('perc_lucroA').focus();
              }
            } else {
              if (rowEdit) {
                rowEdit.id_tp          = null;
                rowEdit.desc_tab_prazo = null;
                rowEdit.perc_lucro     = null;
                rowEdit.desc_tab_comp  = null;
                rowEdit.tipo           = null;
                rowEdit.valor          = null;
              }
            }
          }

          vm.addNovo = function () {
            vm.data.novo({id_tabela_preco:null});
            var startFoco = function () {
              document.getElementById('selectTab').focus();
            }
            setTimeout(startFoco, 500);
          }

          vm.confimarAddTabela = function () {
            var existe = $filter('filter')(vm.data.rows,{id_tp:vm.data.row.id_tp},true);
            if (existe.length == 0) {
              vm.data.adicionar(vm.data.row);
            } else {
              logger.warning('Essa tabela já foi adicionada!');
            }
            
            vm.data.row = null;
            vm.tabPrazo.data.row = null;
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

          vm.deleteAll = function (ev) {
            for (var i = 0; i < vm.data.rowsSelected.length; i++) {
              vm.data.remover(vm.data.rowsSelected[i]);
            }
            vm.data.confirmDel(ev,'Todos os registros selecionados').then(function (result) {
              if (result) {
                vm.data.aplyUpdates(/*atualizar apos a alterao*/true).then(function (result) {
                  if (result) {
                    vm.data.rowsSelected = [];
                  }
                });
              }
            });
          }

        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('ItemFuncService', ItemFuncService);

    ItemFuncService.$inject = [
      'UtilsFunctions','ItemDataSet','UtilsDataFunctionService','CategoriaFuncService','FornFuncService','ItemTabPrecoFuncService','TabPrazosFuncService',
      '$state','$mdDialog','$filter','logger','AutomacaoDataset'
    ];

    /* @ngInject */
    function ItemFuncService(
      UtilsFunctions,ItemDataSet,UtilsDataFunctionService,CategoriaFuncService,FornFuncService,ItemTabPrecoFuncService,TabPrazosFuncService,
      $state,$mdDialog,$filter,logger,AutomacaoDataset
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetProvider = ItemDataSet.item();
          var dataSetCat   = AutomacaoDataset.categoria();
          var dataSetUni  = AutomacaoDataset.unidade();
          vm.item = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.catDataFunc = new CategoriaFuncService.funcoes();
          vm.uniDataFunc = new UtilsDataFunctionService.dataFuncoes(dataSetUni);
          vm.fornecedor = new FornFuncService.funcoes();
          vm.tabPrazos = new TabPrazosFuncService.funcoes();
          vm.divider = 'botton';
          vm.item.title = 'Itens do estoque';
          vm.tabela='';
          vm.filtroEstoque = {
            abaixo_saldo_min:false,
            abaixo_saldo_max:false,
          };


          vm.filtrar = function () {
            var query = '';
            if (isset(vm.tabela)) {
              query += ' and tp.id_tp = '+vm.tabela;
              dataSetProvider.modCamposTab(true);
            } else {
              dataSetProvider.modCamposTab(false);
            }
            if (isset(vm.item.filtros.mainField)) {
              query += " and i.descricao LIKE '"+vm.item.filtros.mainField+"%'";
            }
            if (vm.filtroEstoque.abaixo_saldo_min) {
              query += " and i.saldo <= i.saldo_min ";
            }
            if (vm.filtroEstoque.abaixo_saldo_max) {
              query += " and i.saldo < i.saldo_max ";
            }

            return vm.item.read(query,true).then(function (result) {
              return result
            });//limitar os registro
          }

          vm.filtroAutoComplete = function (prm,prmtab) {
            var query = " and i.status = 1 ";
            if (isset(vm.tabela)) {
              query += ' and tp.id_tp = '+vm.tabela;
              dataSetProvider.modCamposTab(true);
            } else {
              dataSetProvider.modCamposTab(false);
            }
            if (isset(prm)) {
              query += " and i.descricao LIKE '"+prm+"%'";
            }
            return vm.item.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.changeAutoComplete = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.parent)) {
                rowEdit.categoria = rowSelect.descricao;
                rowEdit.id_categoria = rowSelect.id_categoria;
              }
            } else {
              rowEdit.categoria = '';
              rowEdit.id_categoria = null;
            }
          }

          vm.changeAutoCompleteForn = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.nome_red)) {
                rowEdit.fornecedor = rowSelect.nome_red;
                rowEdit.id_fornecedor = rowSelect.id_fornecedor;
              }
            } else {
              rowEdit.fornecedor = '';
              rowEdit.id_fornecedor = null;
            }
          }


          vm.filtrarUnidade = function () {
            if (vm.uniDataFunc.rows.length == 0) {
              vm.uniDataFunc.read('');
            }
          }

          vm.filtrarTabela = function () {
            if (vm.tabPrazos.data.rows.length == 0) {
              vm.tabPrazos.data.read('');
            }
          }
          vm.novo = function () {
            vm.cadastro('create',{})
            vm.item.setNewChilder(ItemTabPrecoFuncService,vm.item.row,false);
          }

          vm.alterar = function (row) {
            if (!isset(row.child)) {//se nao tiver child instanciado, cria a instancia
              vm.item.setNewChilder(ItemTabPrecoFuncService,row,true);
            }
            vm.cadastro('update',row);
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.item.novo(row,'layout.pgitem.cadastros.item');
                break;
              case 'update':
                vm.item.alterar(row,'layout.pgitem.cadastros.item');
                break;
              default:
            }
          }

          vm.salvar = function () {
            vm.item.salvar().then(function (result) {
              if (result) {
                //atualiza tabela de preços
                for (var i = 0; i < vm.item.row.child.data.rows.length; i++) {
                  if (!isset(vm.item.row.child.data.rows[i].id_item)) {
                    //se nao tiver o id_item, adiciona
                    vm.item.row.child.data.rows[i].id_item = vm.item.row.id_item;
                  }
                }
                vm.item.row.child.data.aplyUpdates().then(function (argument) {
                  $state.go('layout.pgitem.cadastros');
                });
              }
            });
          }

          vm.deletar = function (ev,data) {
            vm.item.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.item.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

         vm.selectItem = function ($event,element) {
            var config = {
              templateUrl: 'app/sistema/automacao/item/templates/item-select.html',
              size:'lg',
              data:vm,
              backdrop:true,
              fullscreen:false,
              modal:{},
            };
            return vm.item.showModal(config,element).then(function (result) {
              return result;
            });
          }

          vm.startFoco = function () {
            // função para iniciar o foco do autocomplete na template item-select
            var focus = function () {
              document.getElementById('autocompleteItem').focus();
            }
            setTimeout(focus,500);
          }

          vm.focarGrade = function () {
            var focus = function () {
              document.getElementById('tr'+vm.item.rowIndex).focus();
            }
            setTimeout(focus,500);
          }

          vm.setTabelaPadrao = function () {
            if (isset(vm.item.dataSetProvider.empresa.config_id_tp_padrao)) {
              vm.tabela = vm.item.dataSetProvider.empresa.config_id_tp_padrao;
            } else {
              logger.error('Os itens não poderam ser exibidos porque a tabela de preço padrão não foi definida em configurações.');
            }
          }

          vm.printEstoque = function (rows) {
            var styleTable = UtilsFunctions.stylePrintTable();
            var tpl = '<style>  #printable {display: block;font: 8pt courier;color: #000;line-height: 1.4em;}'+styleTable+'  </style>';
            tpl=tpl+"<div class='row'><div class='col-xs-12' id='printable'>";
            /*cabeçario*/
            var dt = new Date();
            tpl=tpl+"<div align='center'> <h1>Estoque</h1></div>";
            tpl=tpl+"<div>";
            tpl=tpl+"<p><b>Data : </b> "+$filter('date')(dt,'dd/MM/yyyy HH:mm')+"</p>";
            tpl=tpl+"<i>FILTROS : </i>";
            angular.forEach(vm.item.filtros.fildsQuery, function(value, key){
              tpl=tpl+"<span><b>"+value.alias+" : </b> "+value.value+" </span> " ;
            });
            tpl=tpl+"<hr>";
            /*corpo*/

            tpl=tpl+"<div class=''><table class='table table-condensed table-striped'>";
            tpl=tpl+"<thead><tr>";
            tpl=tpl+"<th style='width: 10%'>Código.</th>";
            tpl=tpl+"<th style='width: 40%'>Item</th>";
            tpl=tpl+"<th style='width: 20%'>Marca</th>";
            tpl=tpl+"<th style='width: 15%'>Saldo Atual</th>";
            tpl=tpl+"<th style='width: 15%'>Sugest. Comprar</th>";
            tpl=tpl+"</tr></thead>";
            tpl=tpl+"<tbody>";
            angular.forEach(rows, function(value, key){
                tpl=tpl+"<tr class='striped'>";
                tpl=tpl+"<td>"+value.codigo+"</td>";
                tpl=tpl+"<td>"+value.descricao+"</td>";
                tpl=tpl+"<td>"+value.marca+"</td>";
                tpl=tpl+"<td>"+$filter('currency')(value.saldo,'')+"</td>";
                tpl=tpl+"<td>"+$filter('currency')(value.saldo<value.saldo_max?(value.saldo_max-value.saldo):0,'')+"</td></tr>"
            });
            tpl=tpl+"</tbody></table></div>";
            /*fim container*/
            tpl=tpl+"</div></div>";


            window.frames["print_frame"].document.body.innerHTML = tpl;
            window.frames["print_frame"].window.focus();
            window.frames["print_frame"].window.print();// 

          }

        }
    }
})();

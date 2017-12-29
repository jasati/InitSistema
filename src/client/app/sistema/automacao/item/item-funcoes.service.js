(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('ItemFuncService', ItemFuncService);

    ItemFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService','CategoriaFuncService','FornFuncService','ItemTabPrecoFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function ItemFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,CategoriaFuncService,FornFuncService,ItemTabPrecoFuncService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetProvider = AutomacaoDataset.item();
          var dataSetCat   = AutomacaoDataset.categoria();
          var dataSetUni  = AutomacaoDataset.unidade();
          vm.item = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.catDataFunc = new CategoriaFuncService.funcoes();
          vm.uniDataFunc = new UtilsDataFunctionService.dataFuncoes(dataSetUni);
          vm.itemTabPrecoFunc = new ItemTabPrecoFuncService.funcoes();
          vm.fornecedor = new FornFuncService.funcoes();
          vm.divider = 'botton';
          vm.title = 'Modulo de item';
          vm.tabela =0;
          vm.filtroEstoque = {
            abaixo_saldo_min:false,
            abaixo_saldo_max:false,
          };

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.item.filtros.mainField)) {
              query += " and i.descricao LIKE '"+vm.item.filtros.mainField+"%'";
            }
            if (isset(vm.tabela)) {
              vm.item.dataSetProvider.campos = vm.item.dataSetProvider.camposDinamicos(vm.tabela);
            } else {
              vm.item.dataSetProvider.campos = vm.item.dataSetProvider.camposDinamicos(0);
            }
            if (vm.filtroEstoque.abaixo_saldo_min) {
              query += " and i.saldo <= i.saldo_min ";
            }
            if (vm.filtroEstoque.abaixo_saldo_max) {
              query += " and i.saldo < i.saldo_max ";
            }

            vm.item.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm,prmtab) {
            var query = " and i.status = 1 ";
            if (isset(prm)) {
              var query = " and i.descricao LIKE '"+prm+"%'";
            }
            if (isset(prmtab)) {
              vm.item.dataSetProvider.campos = vm.item.dataSetProvider.camposDinamicos(prmtab);
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

          vm.calcLucro = function (row,tipo) {
            if (tipo=="%") {
              row.preco = Number(((row.custo*row.perc_preco/100)+row.custo).toFixed(2));
            } else {
              row.perc_preco = Number(((row.preco-row.custo)/row.custo*100).toFixed(2));//calculo para descobrir o lucro
            }
          }


          vm.filtrarUnidade = function () {
            if (vm.uniDataFunc.rows.length == 0) {
              vm.uniDataFunc.read('');
            }
          }

          vm.filtrarTabela = function () {
            if (vm.tabPrecoItem.rows.length == 0) {
              vm.tabPrecoItem.read('');
            }
          }
          vm.novo = function () {
            vm.cadastro('create',{})
          }

          vm.alterar = function (row) {
            vm.cadastro('update',row);
            vm.itemTabPrecoFunc.setMasterData(row);
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
                $state.go('layout.pgitem.cadastros');
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

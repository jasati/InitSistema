(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('MovItensFuncService', MovItensFuncService);

    MovItensFuncService.$inject = [
      'UtilsFunctions','MovDataSet','UtilsDataFunctionService','FiltroService','ItemFuncService','ItemTabPrecoFuncService',
      '$state','$mdDialog','$filter','logger'
    ];

    /* @ngInject */
    function MovItensFuncService(
      UtilsFunctions,MovDataSet,UtilsDataFunctionService,FiltroService,ItemFuncService,ItemTabPrecoFuncService,
      $state,$mdDialog,$filter,logger
    ) {
        this.funcoes = funcoes;

        function funcoes(movFunc) {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.isset = UtilsFunctions.isset;
          vm.soma = UtilsFunctions.soma;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetProvider = MovDataSet.movitens();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.data.title = 'Itens da movimentação';
          vm.itens = new ItemFuncService.funcoes();
          vm.itensTab = new ItemTabPrecoFuncService.funcoes();
          vm.divider = 'botton';
          vm.showDadosPessoa = true;

          vm.activate = function () {
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionDinamic = vm.filtroAutoComplete;//função que aciona o auto complete do filtro      
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.data.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.data.setPagination();
            vm.data.filtros.setFiltroData(vm.data.filtroData);
            vm.data.filtros.functionRead();//chama a consulta
          }

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.data.filtros.mainField)) {
              query += " and i.descricao LIKE '"+vm.data.filtros.mainField+"%'";
            }
            if (isset(vm.data.rowParent)) {
              query += " and em.id_mov = "+vm.data.rowParent.id_mov
            } else {
              //filtros quando os itens estão sendo visualizado sem a movimentação pai
              // if (isset(vm.data.filtros.tipo_mov) {
              //   query += " and tmp.tipo = "+vm.data.rowParent.id_mov
              // }
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and descricao LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.showItemSelect = function ($event) {
            if (vm.data.rowParent.status != 'F') {
              vm.showDadosPessoa = false;
              if (isset(vm.data.rowParent.id_tabela)) {
                vm.itens.idClassTabela = vm.data.rowParent.id_tabela;
              } else {
                vm.itens.idClassTabela = '';
              }
              if (vm.data.rows.length > 0) {
                vm.itens.disablTabela = true;
              } else {
                vm.itens.disablTabela = false;
              }
              if (isset(vm.data.rowParent.id_tp)) {
                vm.itens.tabela = vm.data.rowParent.id_tp;
              }
              if (!vm.itens.item.row) {
              vm.itens.selectItem($event,'#movcad').then(function (result) {
                if (result) {
                  var newItem = UtilsFunctions.copiarObjecto(vm.itens.item.row)
                  //filtrar item para evitar dulplicidade
                  var oldItem = $filter('filter')(vm.data.rows,{id_item:newItem.id_item},true);
                  if (oldItem.length > 0) {//existe item?
                    if (isset(oldItem[0].action)) {
                      // verifica se ele foi removido para tratar os actions
                      if (oldItem[0].action =='-d') {
                        oldItem[0].action ='c';
                      } else if (oldItem[0].action =='d') {
                        oldItem[0].action ='u';
                      }
                    }
                    vm.alterarItemMov(oldItem[0]);
                  } else {
                    vm.data.novo(newItem);//preenche o campo row do itens do movimento
                    if (vm.data.rowParent.tipo_mov == 'E') {
                      vm.data.setNewChilder(ItemTabPrecoFuncService,vm.data.row,true);
                      //vm.data.row.valor = vm.data.row.custo;
                    }
                    vm.data.row.qt = 1;
                    vm.data.row.desconto = 0;
                    vm.data.row.desc_perc = 0;
                    setTimeout(vm.startFoco, 500);
                    vm.itens.filtrarUnidade();
                  }
                  vm.data.rowParent.id_tp = vm.itens.tabela;
                }
              });
              }
            }

          }

          vm.addItem = function () {
            if (isset(vm.data.row)) {
              if (vm.data.actionRow == 'create') {
                vm.data.adicionar(vm.data.row);
              }
              vm.cancelarItem();
              vm.showItemSelect();
            }
          }

          vm.loadItem = function ($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
              if (vm.data.rowParent.status!='F') {
                vm.addItem();
              }
            }
          }

          vm.alterarItemMov = function (row,index) {
            if (!vm.bloquearAlteracao()) {
              vm.data.alterar(row);
              vm.data.rowIndex = index;
              if (vm.data.rowParent.tipo_mov == 'E') {
                vm.data.setNewChilder(ItemTabPrecoFuncService,vm.data.row,true);
              }
              setTimeout(vm.startFoco, 500);
            } else {
              var situacao = '';
              if (vm.data.rowParent.status=='F') {
                situacao = "Fechada.";
              } else {
                situacao = "Cancelada."
              }
              logger.warning('Movimentação não pode ser alterada, porque ela está '+situacao);
            }
          }

          vm.showTabela = function (row) {
            row.custo=row.valor
            row.child.showTabela('').then(function () {
              document.getElementById('btnOk').focus();
            });
            
          }

          vm.bloquearAlteracao = function () {
            if (vm.data.rowParent.tipo_mov == "S" || vm.data.rowParent.tipo_mov == "E") {
              if (vm.data.rowParent.status == "F" || vm.data.rowParent.status == "C") {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
          vm.cancelarItem = function () {
            vm.itens.item.row = null;
            vm.data.row = null
          }

          vm.removerItem = function () {
            vm.data.removerIndex();
            vm.cancelarItem();
          }

          vm.startFoco = function () {

            document.getElementById('qt').focus();
            document.getElementById('qt').select();
          }

          vm.clearItemSel = function () {
            vm.itemSel = {
              id_mov    : vm.data.rowParent.id_mov?vm.data.rowParent.id_mov:null,
              id_item   : null,
              qt        : 1.00,
              valor     : 0.00,
              desconto  : 0.00,
              acres     : 0.00,
              descricao : null,
              total     : 0.00,
              preco     : 0.00,
              perc_preco: 0.00,
              sigla     : null,
              calcTotal     : function () {
                            this.total = ((this.qt*this.valor)+this.acres)-this.desconto;
                          },
            }

          }

          vm.setItemSel = function (row,tipo) {
            if (isset(row)) {
              vm.itemSel = {
                id_mov    : vm.data.rowParent.id_mov?vm.data.rowParent.id_mov:null,
                codigo    : row.codigo,
                id_item   : row.id_item,
                id_unidade: row.id_unidade,
                qt        : 1.00,
                valor     : tipo=='E'?row.custo:row.preco_tabela,
                desconto  : 0.00,
                acres     : 0.00,
                descricao : row.descricao,
                total     : 0.00,
                sigla     : row.sigla,
                preco     : row.preco,
                perc_preco: row.perc_preco,
                calcTotal     : function () {
                  this.total = ((this.qt*this.valor)+this.acres)-this.desconto;
                },
                calcLucro : function () {
                  this.perc_preco = ((this.preco-this.valor)/this.valor*100);//calculo para descobrir o lucro
                },
                calcPreco : function () {
                  this.preco = (this.valor*this.perc_preco/100)+this.valor;
                }

              };
              vm.itemSel.calcTotal();
              vm.itemSel.calcLucro();
            }
          }

          vm.calcDesc = function (row,tipo) {
            var total = (row.qt*row.valor);
            if (tipo=="%") {//tipo de entrada
              row.desconto = Number((row.desc_perc * total / 100).toFixed(2));
            } else {
              row.desc_perc = Number((row.desconto / total * 100).toFixed(2));
            }
          }

          vm.calcLucro = function (row,tipo) {
            if (tipo=="%") {
              row.preco = Number(((row.custo*row.perc_preco/100)+row.custo).toFixed(2));
            } else {
              row.perc_preco = Number(((row.preco-row.custo)/row.custo*100).toFixed(2));//calculo para descobrir o lucro
            }
            row.valor=row.custo
          }

          vm.alterarTabela = function (perc) {
            angular.forEach(vm.data.rows, function(value, key){
              var valor = Number(((perc * value.preco /100)+value.preco).toFixed(2));
              value.perc_tabela = perc;
              value.valor = valor;
              vm.data.onChange(value);
            });
          }



          vm.print1 = function (master,detal) {
            var styleTable = UtilsFunctions.stylePrintTable();
            var tpl = '<style>  #printable {display: block;font: 8pt courier;color: #000;line-height: 1.4em;}'+styleTable+'  </style>';
            tpl=tpl+"<div class='row'><div class='col-xs-12' id='printable'>";
            /*cabeçario*/
            tpl=tpl+"<h1>Pacal Motos</h1><hr>"
            tpl=tpl+"<div class='col-xs-6'>";
            tpl=tpl+"<p><b>Nome Fantasia </b>: "+master.p_dest_nome_red+"</p>";            
            tpl=tpl+"<p><b>Nome Cliente .</b>: "+master.p_dest_nome_comp+"</p>";
            tpl=tpl+"<p><b>Endereço . . .</b>: "+master.p_dest_logradouro+"</p>";
            tpl=tpl+"<p><b>Cidade . . . .</b>: "+master.p_dest_cidade+"</p>";
            tpl=tpl+"</div>";
            tpl=tpl+"<div class='col-xs-6'>";
            tpl=tpl+"<p><b>CPF/CNPJ </b>: "+master.p_dest_cfp_cnpj+"</p>";            
            tpl=tpl+"<p><b>Contato .</b>: "+master.p_dest_tel+"</p>";
            tpl=tpl+"<p><b>Numero . </b>: "+master.numero+"</p>";
            tpl=tpl+"<p><b>Data . . </b>: "+$filter('date')(master.data_emissao,'dd/MM/yyyy HH:mm')+"</p>";
            tpl=tpl+"</div>";

            /*corpo*/

            tpl=tpl+"<div class=''><table class='table table-condensed table-striped'>";
            tpl=tpl+"<thead><tr>";
            tpl=tpl+"<th style='width: 5%'>Qtde.</th>";
            tpl=tpl+"<th style='width: 40%'>Item</th>";
            tpl=tpl+"<th style='width: 15%'>Marca</th>";
            tpl=tpl+"<th style='width: 5%'>UNI</th>";
            tpl=tpl+"<th style='width: 10%' class='text-right'>Valor</th>";
            tpl=tpl+"<th style='width: 10%' class='text-right'>Desc.</th>";
            tpl=tpl+"<th style='width: 15%' class='text-right'>Sub Total</th>";
            tpl=tpl+"</tr></thead>";
            tpl=tpl+"<tbody>";
            angular.forEach(detal, function(value, key){
                tpl=tpl+"<tr class='striped'>";
                tpl=tpl+"<td>"+$filter('currency')(value.qt,'')+"</td>";
                tpl=tpl+"<td>"+value.descricao+"</td>";
                tpl=tpl+"<td>"+value.marca+"</td>";
                tpl=tpl+"<td>"+value.sigla+"</td>";
                tpl=tpl+"<td class='text-right'>"+$filter('currency')(value.valor,'')+"</td>";
                tpl=tpl+"<td class='text-right'>"+$filter('currency')(value.desconto,'')+"</td>";
                tpl=tpl+"<td class='text-right'>"+$filter('currency')((value.qt*value.valor)-value.desconto,'')+"</td></tr>"
            });
            tpl=tpl+"</tbody>";
            tpl=tpl+"<tfoot>";
            tpl=tpl+"<tr><td></td>";
            tpl=tpl+"<td></td>";
            tpl=tpl+"<td></td>";
            tpl=tpl+"<td></td>";
            tpl=tpl+"<td></td>";
            tpl=tpl+"<td>"+detal.length+" Item(s)</td>";
            tpl=tpl+"<td class='text-right'><b>Total : </b>"+$filter('currency')(vm.soma(detal,'qt','valor')-vm.soma(detal,'','desconto'))+"</td></tr>";
            tpl=tpl+"</tfoot></table></div>";
            /*roda pe*/
            
            tpl=tpl+"<span>Obs:</span></br>";
            tpl=tpl+"<span>"+master.obs+"</span>";
            tpl=tpl+"<hr>";
            /*fim container*/
            tpl=tpl+"</div></div>";


            window.frames["print_frame"].document.body.innerHTML = tpl;
            window.frames["print_frame"].window.focus();
            window.frames["print_frame"].window.print();// 

          }

          vm.alterar = function (row) {
            vm.cadastro('update',row);
          }

        }
    }
})();

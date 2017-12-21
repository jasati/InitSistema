(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('MovFuncService', MovFuncService);

    MovFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService','FiltroService','PessoaFuncService','ClienteFuncService','ConfigTabPrecoFuncService','MovItensFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function MovFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,FiltroService,PessoaFuncService,ClienteFuncService,ConfigTabPrecoFuncService,MovItensFuncService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.soma = UtilsFunctions.soma;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetProvider = AutomacaoDataset.movEstoque();
          var dataSetNumNf = AutomacaoDataset.numeroNf();
          var dataSetMovSaldo = AutomacaoDataset.movSaldoEstoque();
          vm.getNumNf = new UtilsDataFunctionService.dataFuncoes(dataSetNumNf);
          vm.movSaldoEstoque = new UtilsDataFunctionService.dataFuncoes(dataSetMovSaldo);
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.dataItens = new MovItensFuncService.funcoes();
          vm.pessoa_emi = new PessoaFuncService.funcoes();
          vm.pessoa_dest = new PessoaFuncService.funcoes();
          vm.clientes = new ClienteFuncService.funcoes();
          vm.classTabela = new ConfigTabPrecoFuncService.funcoes();

          vm.divider = 'botton';
          vm.data.title = 'Movimentações';

          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Nova Movimentação',
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
            dataSetProvider.valueForeignKey.push(1);//filial
            dataSetProvider.valueForeignKey.push(vm.tipoMov.data.row.id_tipo_mov);//tipo movimentacao
            vm.data.filtros.functionRead();//chama a consulta
          }

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.data.filtros.mainField)) {
              query += " and pessoa_mov_nome_comp LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and pessoa_mov_nome_comp LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.changeEmitenteE = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.id_pessoa)) {
                rowEdit.id_pessoa_emitente = rowSelect.id_pessoa;
                rowEdit.p_emi_nome_comp    = rowSelect.nome_comp;
                rowEdit.p_emi_nome_red     = rowSelect.nome_red;
                if (isset(rowSelect.id_fornecedor)) {
                  rowEdit.id_fornecedor = rowSelect.id_fornecedor;
                }
              }
            } else {
                rowEdit.id_pessoa_emitente = null;
                rowEdit.p_emi_nome_comp    = null;
                rowEdit.p_emi_nome_red     = null;
                rowEdit.id_fornecedor      = null;
            }
          }

          vm.changeDestinatarioE = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.id_pessoa)) {
                rowEdit.id_pessoa_destinatario = rowSelect.id_pessoa;
                rowEdit.p_dest_nome_comp    = rowSelect.nome_comp;
                rowEdit.p_dest_nome_red     = rowSelect.nome_red;
                rowEdit.p_dest_logradouro     = rowSelect.logradouro;
                rowEdit.p_dest_cidade     = rowSelect.cidade;
                if (isset(rowSelect.id_cliente)) {
                  rowEdit.limite_credito     = rowSelect.limite_credito;
                  rowEdit.id_tabela_preco     = rowSelect.id_tabela_preco;
                  vm.filtrarClassTabela();
                }
              }
            } else {
                rowEdit.id_pessoa_destinatario = null;
                rowEdit.p_dest_nome_comp    = null;
                rowEdit.p_dest_nome_red     = null;
                rowEdit.tabela_preco        = null;
                rowEdit.limite_credito      = null;
            }
          }


          vm.startMovimento = function () {
            if (vm.data.actionRow == 'create') {
              if (vm.tipoMov.data.row.tipo == 'E') {
                novaEntrada()
              } else {
                novaSaida();
              }
            }
          }
          //venda ou saida no estoue
          var novaSaida = function () {
            var id_consumidor_padrao = 2; //1 - buscar consumidor padrão
            var id_filial = 1;//buscar a pessoa emitente que é a filial
            vm.clientes.filtroAutoComplete('',id_consumidor_padrao).then(function (rest1) {
              vm.changeDestinatarioE(vm.data.row,rest1[0]);
              vm.pessoa_emi.filtroAutoComplete('',id_filial).then(function (rest2) {
                vm.changeEmitenteE(vm.data.row,rest2[0]);
                vm.dataItens.clearItemSel();
                //gerar numero nf automatico
                vm.getNumNf.functionSql().then(function (n_nf) {
                  vm.data.row.n_nf = n_nf.result;
                  vm.showItens();
                });
              });
            });
          }

          var novaEntrada = function () {
            var id_filial = 1;//buscar a pessoa emitente que é a filial
            vm.pessoa_dest.filtroAutoComplete('',id_filial).then(function (rest1) {
              vm.changeDestinatarioE(vm.data.row,rest1[0]);
              vm.showItens();
              setTimeout(function () {
                document.getElementById('p_emi_nome_comp').focus();
              },500);
              
            });
          }

          vm.novo = function () {
            var row = {
              id_mov         : 0,
              id_vendedor    : 1,
              status         : 'A',
              desc_status    : 'ABERTO',
              data_emissao   : new Date(),
              desc_tipo_mov  : vm.tipoMov.data.row.descricao,
              tipo_mov       : vm.tipoMov.data.row.tipo,
              total          : 0,
              total_desc     : 0,
              total_acres    : 0,
              id_item_preco  : 0,
              id_tabela_preco: null,
            }
            vm.data.novo(row,'layout.tipomov.movs.mov');
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.tipomov.movs.mov');
            vm.showItens();
          }

          vm.showItens = function () {
            vm.dataItens.movimento = vm.data.row;
            vm.dataItens.activate();
          }

          vm.finalizarMov = function (ev) {
            var confirm = $mdDialog.confirm()
                  .title('Finalizar '+vm.data.row.desc_tipo_mov)
                  .textContent('Você confirma a finalização da '+vm.data.row.desc_tipo_mov+'?')
                  .ariaLabel('Finalizaçcao')
                  .targetEvent(ev)
                  .ok('Confirmo a finalização!')
                  .cancel('Não, ainda não termeinei.');

            $mdDialog.show(confirm).then(function() {
              vm.data.row.desc_status = 'FINALIZADO';
              vm.data.row.status = 'F';
              vm.salvar(ev);
            },function () {
              // cancelou
            });
          }

          vm.concluirVenda = function (ev) {
            var prm = {
              templateUrl: 'app/sistema/automacao/movestoque/templates/mov-fecha-venda.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            vm.data.showModal(prm).then(function (result) {
                vm.filtrar();
                $state.go('layout.tipomov.movs');
            });
          }

          vm.salvar = function (ev) {
            vm.data.salvar().then(function (result) {
              if (result) {
                //informar o id mov caso os itens nao tenha
                var itensOrfaos = $filter('filter')(vm.dataItens.data.rows,{id_mov:undefined},true);
                for (var i = 0; i < itensOrfaos.length; i++) {
                  itensOrfaos[i].id_mov = vm.data.row.id_mov;
                }
                vm.dataItens.data.aplyUpdates(true).then(function (result) {
                  if (result) {
                      // verificar se o tipo de movimentação altera o cadastro do item
                      if (vm.tipoMov.data.row.alt_cad_item) {
                        vm.dataItens.itens.item.rows = vm.dataItens.data.rows;
                        for (var i = 0; i < vm.dataItens.itens.item.rows.length; i++) {
                          vm.dataItens.itens.item.rows[i].action = 'u';
                          if (isset(vm.data.row.id_fornecedor)) {
                            vm.dataItens.itens.item.rows[i].id_fornecedor = vm.data.row.id_fornecedor;
                          }
                        }
                        vm.dataItens.itens.item.aplyUpdates(false);
                      }
                      //verifica se o tipo de movimentação movimenta estoque
                      if (vm.tipoMov.data.row.mov_estoque) {
                        vm.movSaldoEstoque.functionSql();
                      }
                      if (vm.data.row.tipo_mov == 'E') {
                        vm.filtrar();
                        $state.go('layout.tipomov.movs');
                      } else {
                        vm.concluirVenda(ev);
                      }

                  }
                });
              }
            });
          }



          vm.filtrarClassTabela = function () {
            if (vm.classTabela.tabela.rows.length == 0) {
              vm.classTabela.tabela.read('')
              vm.classTabela.TabItens.tabela_itens.read('');
            }
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

        }
    }
})();

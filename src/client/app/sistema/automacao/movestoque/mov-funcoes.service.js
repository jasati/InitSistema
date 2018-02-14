(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('MovFuncService', MovFuncService);

    MovFuncService.$inject = [
      'UtilsFunctions','MovDataSet','AutomacaoDataset','UtilsDataFunctionService','FiltroService','PessoaFuncService','ClienteFuncService','TabPrazosFuncService','MovItensFuncService','VendedorFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function MovFuncService(
      UtilsFunctions,MovDataSet,AutomacaoDataset,UtilsDataFunctionService,FiltroService,PessoaFuncService,ClienteFuncService,TabPrazosFuncService,MovItensFuncService,VendedorFuncService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.soma = UtilsFunctions.soma;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetProvider = MovDataSet.mov();
          var dataSetNumNf = AutomacaoDataset.numeroNf();
          var dataSetMovSaldo = AutomacaoDataset.movSaldoEstoque();
          vm.getNumNf = new UtilsDataFunctionService.dataFuncoes(dataSetNumNf);
          vm.movSaldoEstoque = new UtilsDataFunctionService.dataFuncoes(dataSetMovSaldo);
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.movDataItens = new MovItensFuncService.funcoes();
          vm.pessoa_emi = new PessoaFuncService.funcoes();
          vm.pessoa_dest = new PessoaFuncService.funcoes();
          vm.clientes = new ClienteFuncService.funcoes();
          vm.tabelas = new TabPrazosFuncService.funcoes();
          vm.vendedor = new VendedorFuncService.funcoes();

          vm.divider = 'botton';
          vm.tabview = 0;//dados movimento

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
            vm.data.filtros.setFiltroData(vm.data.filtroData);
            vm.data.filtros.functionRead();
          }

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.data.filtros.mainField)) {
              query += " and pessoa_mov_nome_comp LIKE '"+vm.data.filtros.mainField+"%'";
            }
            return vm.data.read(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.filtroAutoComplete = function (prm,tipo) {
            var query = " and CONCAT(em.numero,pd.nome_comp,pd.nome_red) LIKE '%"+prm+"%'";
            if (isset(tipo)) {
              query = " and em.id_tipo_mov = "+tipo;
            }
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
                rowEdit.p_dest_nome_comp       = rowSelect.nome_comp;
                rowEdit.p_dest_nome_red        = rowSelect.nome_red;
                rowEdit.p_dest_logradouro      = rowSelect.logradouro;
                rowEdit.p_dest_cidade          = rowSelect.cidade;
                if (isset(rowSelect.id_cliente)) {
                  rowEdit.limite_credito     = rowSelect.limite_credito;
                  rowEdit.id_tabela          = rowSelect.id_tabela;
                }
                rowEdit.tabela             = rowSelect.tabela?rowSelect.tabela:'NÃO DEFINIDA';
                vm.filtrarTabela(rowSelect.id_tabela);                
              }
            } else {
                rowEdit.id_pessoa_destinatario = null;
                rowEdit.p_dest_nome_comp    = null;
                rowEdit.p_dest_nome_red     = null;
                rowEdit.tabela_preco        = null;
                rowEdit.limite_credito      = null;
            }
          }

          vm.changeAutoCompleteVend = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.id_vendedor)) {
                rowEdit.id_vendedor       = rowSelect.id_vendedor;
                rowEdit.vendedor_nome_red = rowSelect.nome_red;
              }
            } else {
              rowEdit.id_vendedor       = null;
              rowEdit.vendedor_nome_red = null;
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
            //Configuração para iniciar a venda com o consumidor padrao
            var id_consumidor_padrao = '';
            if (vm.tipoMov.data.row.id_tipo_mov == vm.data.empresa.config_id_tipo_mov_ven_cons) {
              id_consumidor_padrao = vm.data.empresa.config_id_pessoa_cons;
            }
            var id_filial = 1;//buscar a pessoa emitente que é a filial
            vm.clientes.filtroAutoComplete('',id_consumidor_padrao).then(function (rest1) {
              if (isset(id_consumidor_padrao)) {
                vm.changeDestinatarioE(vm.data.row,rest1[0]);
              }
              vm.pessoa_emi.filtroAutoComplete('',id_filial).then(function (rest2) {
                vm.changeEmitenteE(vm.data.row,rest2[0]);
                vm.data.row.id_tp = vm.data.empresa.config_id_tp_padrao;
                vm.data.row.child.clearItemSel();
                if (isset(id_consumidor_padrao)) {
                  if (isset(vm.data.row.id_vendedor)) {
                    vm.tabview = 1;//tab itens
                    vm.data.row.child.selectItem(undefined);
                  } else {
                    document.getElementById('vendedor').focus();
                  }
                } else {
                  document.getElementById('p_dest_nome_comp').focus();
                }
              });
            });
          }

          var novaEntrada = function () {
            var id_filial = 1;//buscar a pessoa emitente que é a filial
            vm.pessoa_dest.filtroAutoComplete('',id_filial).then(function (rest1) {
              vm.changeDestinatarioE(vm.data.row,rest1[0]);
              setTimeout(function () {
                document.getElementById('p_emi_nome_comp').focus();
              },500);
              
            });
          }

          vm.novo = function () {
            var row = {
              id_mov            : 0,
              id_vendedor       : vm.data.userLogado.id_vendedor,
              vendedor_nome_red : vm.data.userLogado.vendedor,
              status            : 'A',
              desc_status       : 'ABERTO',
              data_emissao      : new Date(),
              desc_tipo_mov     : vm.tipoMov.data.row.descricao,
              tipo_mov          : vm.tipoMov.data.row.tipo,
              total             : 0,
              total_desc        : 0,
              total_acres       : 0,
            };
            vm.data.setForengKey(1,0);//id filial posicao 0
            vm.data.setForengKey(vm.tipoMov.data.row.id_tipo_mov,1);
            vm.data.novo(row,'layout.tipomov.movs.mov');
            vm.data.setNewChilder(MovItensFuncService,row,false);
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.tipomov.movs.mov');
            vm.filtrarTabela('');
            vm.data.setNewChilder(MovItensFuncService,vm.data.row,true);
          }

          vm.cancelarMov = function (ev) {
            var confirm = $mdDialog.confirm()
                  .title('Cancelar '+vm.data.row.desc_tipo_mov)
                  .textContent('Você confirma o cancelamento da '+vm.data.row.desc_tipo_mov+'?')
                  .ariaLabel('Cancelamento')
                  .targetEvent(ev)
                  .ok('Sim! Confirme o Cancelamento')
                  .cancel('Não, desistir.');

            $mdDialog.show(confirm).then(function() {
              vm.data.row.desc_status = 'CANCELADO';
              vm.data.row.status = 'C';
              vm.salvar(ev);
            },function () {
              // cancelou
            });
          }

          vm.finalizarMov = function (ev) {
            var confirm = $mdDialog.confirm()
                  .title('Finalizar '+vm.data.row.desc_tipo_mov)
                  .textContent('Você confirma o fechamento da '+vm.data.row.desc_tipo_mov+'?')
                  .ariaLabel('Finalizacao')
                  .targetEvent(ev)
                  .ok('Sim! Confirmar Fechamento')
                  .cancel('Não, ainda não termeinei.');

            $mdDialog.show(confirm).then(function() {
              vm.data.row.desc_status = 'FINALIZADO';
              vm.data.row.status = 'F';
              vm.processoFinalMov(ev);
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

          vm.salvar = function () {
            return vm.data.salvar().then(function (result) {
              if (result) {
                //informar o id mov caso os itens nao tenha
                var itensOrfaos = $filter('filter')(vm.data.row.child.data.rows,{id_mov:undefined},true);
                for (var i = 0; i < itensOrfaos.length; i++) {
                  itensOrfaos[i].id_mov = vm.data.row.id_mov;
                }
                return vm.data.row.child.data.aplyUpdates(false).then(function (result) {
                  return result;
                });
              }
            });
          }

          vm.processoFinalMov = function (ev) {
            var setNumero = function () {
              //gerar numero nf automatico se venda ou pedido
              var prm = dataSetProvider.empresa.id_empresa+",'"+vm.data.row.tipo_mov+"'";
              return vm.getNumNf.functionSql(prm).then(function (numero) {
                return vm.data.row.numero = numero.result;
              });
            }

            var atualizaEstoque = function () {
              //verifica se o tipo de movimentação movimenta estoque
              if (vm.tipoMov.data.row.mov_estoque) {
                vm.movSaldoEstoque.functionSql(dataSetProvider.empresa.id_empresa);
              }
            }

            var alterarCadItens = function () {
              // verificar se o tipo de movimentação altera o cadastro do item
              vm.data.row.child.itens.item.rows = vm.data.row.child.data.rows;
              for (var i = 0; i < vm.data.row.child.itens.item.rows.length; i++) {
                vm.data.row.child.itens.item.rows[i].action = 'u';
                if (isset(vm.data.row.id_fornecedor)) {
                  vm.data.row.child.itens.item.rows[i].id_fornecedor = vm.data.row.id_fornecedor;
                }
              }
              //juntar as tabela de cada item em na instancia principal, fora das dos itens da entrada
              for (var i = 0; i < vm.data.row.child.data.rows.length; i++) {
                for (var x = 0; x < vm.data.row.child.data.rows[i].child.data.rows.length; x++) {
                  var rowTab = vm.data.row.child.data.rows[i].child.data.rows[x];
                  rowTab.action = 'u';
                  vm.data.row.child.itensTab.data.rows.push(rowTab);
                }
              }
              //atulizar os itens
              return vm.data.row.child.itens.item.aplyUpdates(false).then(function () {
                //atualiza as tabelas dos itens
                return vm.data.row.child.itensTab.data.aplyUpdates(false);
              });
            }

            switch (vm.data.row.tipo_mov){
              case 'E':
                vm.salvar().then(function (result) {
                  if (result) {
                    if (vm.tipoMov.data.row.alt_cad_item) {
                      alterarCadItens().then(function () {
                        atualizaEstoque();
                        vm.filtrar();
                        $state.go('layout.tipomov.movs');
                      });
                    } else {
                      atualizaEstoque();
                      vm.filtrar();
                      $state.go('layout.tipomov.movs');
                    }
                  }
                });
                break;
              case 'S':
                if (!vm.data.row.numero) {
                  setNumero().then(function (result) {
                    if (result) {
                      vm.salvar().then(function (result) {
                        if (result) {
                          atualizaEstoque();
                          vm.concluirVenda(ev);
                        }
                      });
                    }
                  });
                } else {
                  vm.data.row.numero = vm.data.row.tipo_mov+vm.data.row.numero;
                  vm.salvar().then(function (result) {
                    if (result) {
                      atualizaEstoque();
                      vm.concluirVenda(ev);
                    }
                  });
                }

                break;
              case 'P':
                setNumero().then(function (result) {
                  if (result) {
                    vm.salvar().then(function (result) {
                      if (result) {
                        atualizaEstoque();
                        vm.concluirVenda(ev);
                      }
                    });
                  }
                });
                break;
            }
          }

          vm.bloquearAlteracao = function () {
            if (vm.data.row.tipo_mov == "S" || vm.data.row.tipo_mov == "E") {
              if (vm.data.row.status == "F" || vm.data.row.status == "C") {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }

          vm.filtrarTabela = function (id) {
            var qry = '';
            if (isset(id)) {
              qry = ' and tp.id_tabela = '+id;
            }
            vm.tabelas.data.read(qry);
          }

          vm.carregarPedidos = function () {
            vm.selectMov('P').then(function (row) {
              vm.tipoMov.data.rowsSelected = [];
              if (row) {
                row.status         = 'A';
                row.desc_status    = 'ABERTO';
                row.desc_tipo_mov  = vm.tipoMov.data.row.descricao;
                row.tipo_mov       = vm.tipoMov.data.row.tipo;
                row.id_tipo_mov    = vm.tipoMov.data.row.id_tipo_mov;
                vm.alterar(row);
              }
            });
          }

          vm.selectMov = function (tipo,element) {
            var tipmovFilter = $filter('filter')(vm.tipoMov.data.rows,{tipo:tipo},true);
            vm.tipoMov.data.rowsSelected.push(tipmovFilter[0]);
            var config = {
              templateUrl: 'app/sistema/automacao/movestoque/templates/mov-select.html',
              size:'',
              data:vm,
              backdrop:true,
              fullscreen:false,
              modal:{},
            };
            return vm.data.showModal(config,element).then(function (result) {
              return result;
            });
          }

          vm.startFoco = function () {
            // função para iniciar o foco do autocomplete na template item-select
            var focus = function () {
              document.getElementById('autocompleteMov').focus();
            }
            setTimeout(focus,500);
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

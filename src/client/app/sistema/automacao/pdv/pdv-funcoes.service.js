(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('PdvFuncService', PdvFuncService);

    PdvFuncService.$inject = [
      'UtilsFunctions','EstacaoFuncService','CaixaFuncService','TipoMovFuncService','MovFuncService','MovItensFuncService','ItemFuncService','PessoaFuncService','ClienteFuncService',
      '$state','$mdDialog','$filter','logger'
    ];

    /* @ngInject */
    function PdvFuncService(
      UtilsFunctions,EstacaoFuncService,CaixaFuncService,TipoMovFuncService,MovFuncService,MovItensFuncService,ItemFuncService,PessoaFuncService,ClienteFuncService,
      $state,$mdDialog,$filter,logger
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.soma = UtilsFunctions.soma;
          vm.onEnter = UtilsFunctions.handleEnter;
          vm.pdv = new EstacaoFuncService.funcoes();
          vm.tipomov = new TipoMovFuncService.funcoes();
          vm.itens = new ItemFuncService.funcoes();
          vm.pessoa = new PessoaFuncService.funcoes();
          vm.clientes = new ClienteFuncService.funcoes();
          vm.modoPdv = 0;//modos 1 venda 2 consulta 3 fechando venda

          vm.activate = function () {
            /*Informar estação de trabalho*/
              if (isset(vm.pdv.data.row)) {
                //instancia o caixa como filho
                vm.pdv.data.setNewChilder(CaixaFuncService,vm.pdv.data.row,true);
                vm.pdv.data.row.child.loadCaixa().then(function (result) {
                  if (isset(vm.pdv.data.row.child.data.row.id_caixa)) {
                    //verificar se o tipo de movimento de venda para consumidor esta definido
                    if (isset(vm.pdv.data.empresa.config_id_tipo_mov_ven_cons)) {
                      //vefirificar se o cliente consumidor padrao esta definido
                      if (isset(vm.pdv.data.empresa.config_id_pessoa_cons)) {
                        //buscar o tipo de movimentação para venda em varejo
                        vm.tipomov.data.filtroExterno = ' and id_tipo_mov = '+vm.pdv.data.empresa.config_id_tipo_mov_ven_cons;
                        vm.tipomov.data.read('',true).then(function (result) {
                          vm.tipomov.data.row = result.reg[0];
                          vm.tipomov.data.setNewChilder(MovFuncService,vm.tipomov.data.row,false);
                          vm.tipomov.data.row.child.pdv = true;
                          vm.setFocusCodBarras();
                          vm.loadQtPedidos();
                          vm.startTimeLoadPed();
                        });

                      } else {
                        logger.warning('O cliente de vendas padrão não foi definido em configurações gerais.');
                        $state.go('layout');
                      }
                    } else {
                      logger.warning('O tipo de movimentação de venda para consumidor ainda não foi definido em configurações gerais.');
                      $state.go('layout');
                    }

                  } else {
                    logger.warning('Você não poderar vender sem confirmar um caixa.');
                    $state.go('layout');
                  }
                });
              } else {
                $state.go('estacoes');
              }
          }

          vm.selectEstacao = function (row) {
            vm.pdv.data.row = row;
            vm.activate();
          }

          vm.abreVenda = function () {
            //verificar se tem caixa
            if (vm.pdv.data.row.child.data.row.status =='A') {
              //se nao tiver venda, abre uma nova
              if (vm.modoPdv ==0) {
                if (!isset(vm.tipomov.data.row.child.data.row)) {
                  //verifica se o usuário tem vendedor vinculado
                  if (isset(vm.pdv.data.userLogado.id_vendedor)) {
                    return vm.pessoa.filtroAutoComplete('',vm.pdv.data.empresa.config_id_pessoa_cons).then(function (result) {
                      var dt = new Date();
                      var novaVenda = {
                        id_mov                 : 0,
                        id_vendedor            : vm.pdv.data.userLogado.id_vendedor,
                        id_tp                  : vm.pdv.data.empresa.config_id_tp_padrao,
                        id_pessoa_emitente     : vm.pdv.data.userLogado.id_pessoa_filial,
                        id_pessoa_destinatario : vm.pdv.data.empresa.config_id_pessoa_cons,
                        p_dest_nome_red        : result[0].nome_red,
                        p_dest_nome_comp       : result[0].nome_comp,
                        p_dest_logradouro      : result[0].logradouro,
                        p_dest_cidade          : result[0].cidade,
                        p_dest_cpf_cnpj        : result[0].cpf_cnpj,
                        p_dest_tel             : result[0].tel,
                        status                 : 'A',
                        desc_status            : 'ABERTO',
                        data_emissao           : dt,
                        data_mov               : dt,
                        data_saida             : dt,
                        total                  : 0,
                        total_desc             : 0,
                        total_acres            : 0,
                      };
                      vm.tipomov.data.row.child.data.setForengKey(vm.pdv.data.userLogado.id_filial,0);//id filial posicao 0
                      vm.tipomov.data.row.child.data.setForengKey(vm.tipomov.data.row.id_tipo_mov,1);
                      vm.tipomov.data.row.child.data.novo(novaVenda);
                      vm.tipomov.data.row.child.data.setNewChilder(MovItensFuncService,vm.tipomov.data.row.child.data.row,false);
                      vm.setFocusCodBarras();
                      return result;
                    });
                  } else {
                    logger.warning('A venda não pode ser iniciada porque o usuário responsavel não está configurado como vendedor.');
                  }
                }
              }
            }
          }


          vm.cancelaVenda = function (ev) {
            if (vm.tipomov.data.row.child.data.row) {
              var msg = 'Confirma o cancelamento da venda em andamento?';
              vm.pdv.data.showMenssage(ev,msg).then(function (result) {
                if (result) {
                  vm.limparDados();
                  vm.setFocusCodBarras();
                } else {
                  vm.setFocusCodBarras();
                }
              });
            }
          }

          vm.limparDados = function () {
            vm.tipomov.data.row.child.data.row = null;
            vm.itens.item.row = null;
            if (isset(vm.pdv.data.row.child.data.row.child)) {
              vm.pdv.data.row.child.data.row.child.data.rows = [];
              vm.pdv.data.row.child.data.row.child.data.row = null;
            }
          }

          vm.fechaVenda = function () {
            if (vm.tipomov.data.row.child.data.row) {
              vm.setModosPdv(2);
            }
          }

          vm.recebimentos = function () {
            var valReceber = vm.totalizacao.totalVenda()-vm.totalizacao.totalRec();
            vm.pdv.data.row.child.data.row.child.totalRec = valReceber;
            vm.pdv.data.row.child.data.row.child.novo().then(function (rec) {
              if (rec) {
                //verificar se tem troco e gravar o valor correto que falta receber da venda
                if (rec.valor > valReceber) {
                  vm.totalizacao.troco = rec.valor - valReceber;
                  rec.valor = valReceber;
                }
                vm.pdv.data.row.child.data.row.child.data.adicionar(rec);
              }
            });
          }

          vm.informaItem = function (ev) {
            if (vm.tipomov.data.row.child.data.row.status =='A'){
              if (!vm.itens.item.row) {
                vm.consultaItem(ev,'#pdv').then(function (item) {
                  if (item) {
                    vm.itens.item.filtros.mainField = item.codigo;
                    vm.itemSearch = item.codigo;
                    if (!isset(item.qt)) {
                      item.qt = 1;
                    }
                    item.desconto = 0;
                    vm.tipomov.data.row.child.data.row.child.data.novo(item);
                    if (vm.pdv.data.empresa.config_show_qt_pdv) {
                      vm.setFocusQt();
                    } else {
                      vm.novoItem(vm.tipomov.data.row.child.data.row.child.data.row);
                    }
                    vm.desableCancelItem();
                  }
                });
              }
            }
          }

          vm.novoItem = function (item) {
            if (vm.modoPdv==0 && isset(item.qt)) {
              if (item.qt > 0) {
                vm.tipomov.data.row.child.data.row.child.data.adicionar(item);
                vm.itens.item.row = null;
                vm.itens.item.filtros.mainField = "";
                vm.itemSearch = "";
                vm.setFocusCodBarras(true);
              } else {
                logger.warning('Quantidade invalida!');
              }
            }
          }

          vm.consultaItem = function (ev) {
            var qt=null, operador=null, codDesc=null, cod="", desc="";
            operador = /[\W]/.exec(vm.itemSearch);
            if (operador) {
                operador = operador.toString(operador);
            };
            qt = /[0-9]*/.exec(vm.itemSearch);
            if (isset(qt[0])) {
              qt = Number(qt[0]);
            } else {
              qt = 1;
            }
            codDesc = /\W.*$/.exec(vm.itemSearch)
            if (codDesc) {
                codDesc = codDesc.toString(codDesc);
                codDesc = codDesc.replace("*","");
            } else {
              codDesc = vm.itemSearch;
            }
            vm.itens.item.filtros.mainField = codDesc;
            //busca item, caso nao encontre ou tenha a qantidade maior que 1 exibir a consulta do item
            if (vm.modoPdv==0) {
              if (vm.tipomov.data.row.child.data.row.child.data.rows.length > 0) {
                vm.itens.disablTabela = true;
              } else {
                vm.itens.disablTabela = false;
              }
              vm.itens.tabela = vm.tipomov.data.row.child.data.row.id_tp;
              return vm.itens.filtrar(true).then(function (result) {
                if (result.qtde == 0 || result.qtde > 1) {
                  return vm.itens.selectItem(ev).then(function (result) {
                    vm.tipomov.data.row.child.data.row.id_tp = vm.itens.tabela;
                    return vm.itens.item.row;
                  });
                } else if (result.qtde == 1) {
                  vm.itens.item.alterar(result.reg[0]);
                  if (isset(qt)) {
                    vm.itens.item.row.qt = qt
                  }
                  return vm.itens.item.row;
                }
              });
            } else {
              vm.itens.tabela = vm.pdv.data.empresa.config_id_tp_padrao;
              return vm.itens.filtrar(true).then(function (result) {
                if (result.qtde == 0 || result.qtde > 1) {
                  return vm.itens.selectItem(ev).then(function (result) {
                    return vm.itens.item.row;
                  });
                } else if (result.qtde == 1) {
                  vm.itens.item.alterar(result.reg[0]);
                  return vm.itens.item.row;
                }
              });
            }

          }

          vm.cancelarItem = function () {
            if (vm.tipomov.data.row.child.data.row) {
              if (vm.activeCancelItem) {
                vm.tipomov.data.row.child.data.row.child.data.removerIndex();
                vm.desableCancelItem();
              } else {
                vm.activeCancelItem = true;
                vm.tipomov.data.row.child.data.row.child.data.rowIndex = 0;
              }
            }
          }

          vm.desableCancelItem = function () {
            vm.activeCancelItem = false;
            vm.tipomov.data.row.child.data.row.child.data.rowIndex = -1;
          }          

          vm.desconto = function () {
            var config = {
              templateUrl: 'app/sistema/automacao/pdv/templates/pdv-desconto.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            vm.pdv.data.showModal(config).then(function () {
              aplicaDescontoItens(vm.totalizacao.desc_perc)
            });
          }

          var aplicaDescontoItens = function (valPerc) {

            //loop nos itens da venda
            for (var i = 0; i < vm.tipomov.data.row.child.data.row.child.data.rows.length; i++) {
              var descReal = 0, valItem = vm.tipomov.data.row.child.data.row.child.data.rows[i].valor*vm.tipomov.data.row.child.data.row.child.data.rows[i].qt;
              descReal = Number(valPerc * valItem / 100);
              vm.tipomov.data.row.child.data.row.child.data.rows[i].desconto = descReal;
              vm.tipomov.data.row.child.data.row.child.data.rows[i].desc_perc = valPerc;
            }
          }

          vm.alterarTabela = function () {
            vm.tipomov.data.row.child.data.row.child.alterarTabela();
          }

          vm.abreCaixa = function () {
            if (vm.pdv.data.row.child.data.row.status == 'F') {
              vm.pdv.data.row.child.abrirCaixa().then(function (result) {
                if (!isset(vm.pdv.data.row.child.data.row.id_caixa)) {
                  //buscar caixa anterior caso não abra um novo caixa
                  vm.pdv.data.row.child.loadCaixa();
                }
                vm.limparDados();
                vm.setFocusCodBarras();
              });
            }
          }

          vm.fechaCaixa = function () {
            vm.pdv.data.row.child.alterar(vm.pdv.data.row.child.data.row).then(function (result) {
              vm.setFocusCodBarras();
            });
          }

          vm.totalizacao = {
            subTotal:function () {
              return vm.soma(vm.tipomov.data.row.child.data.row.child.data.rows,'qt','valor');
            },
            totalDesc:function () {
              return vm.soma(vm.tipomov.data.row.child.data.row.child.data.rows,'','desconto');
            },
            totalVenda:function () {
              return (vm.totalizacao.subTotal()-vm.totalizacao.totalDesc());
            },
            totalRec:function () {
              return vm.soma(vm.pdv.data.row.child.data.row.child.data.rows,'','valor');
            },
            calcDesconto:function (tipo) {
              var total = vm.totalizacao.subTotal();
              if (tipo == "%") {//tipo de entrada em real
                //pegar percentual do valor
                vm.totalizacao.desc_real = Number(vm.totalizacao.desc_perc * total / 100);
              } else {
                vm.totalizacao.desc_perc = Number(vm.totalizacao.desc_real / total * 100);
              }
            },
            troco:0,
            desc_real:0,
            desc_perc:0,
          }

          vm.informaCliente = function () {
            if (vm.tipomov.data.row.child.data.row) {
              vm.clientes.selectClientes().then(function (cliente) {
                if (cliente) {
                  vm.tipomov.data.row.child.data.row.id_pessoa_destinatario = cliente.id_pessoa;
                  vm.tipomov.data.row.child.data.row.p_dest_nome_red        = cliente.nome_red;
                  vm.tipomov.data.row.child.data.row.p_dest_nome_comp       = cliente.nome_comp;
                  vm.tipomov.data.row.child.data.row.p_dest_logradouro      = cliente.logradouro;
                  vm.tipomov.data.row.child.data.row.p_dest_cidade          = cliente.cidade;
                  vm.tipomov.data.row.child.data.row.p_dest_cidade          = cliente.cidade;
                  vm.tipomov.data.row.child.data.row.p_dest_cpf_cnpj        = cliente.cpf_cnpj;
                  vm.tipomov.data.row.child.data.row.p_dest_tel             = cliente.tel;
                  vm.setFocusCodBarras();
                } else {
                  vm.setFocusCodBarras();
                }
              });
            }
          }

          vm.concluirVenda = function () {
            //gerar numero venda
            var prm = vm.tipomov.data.empresa.id_empresa+",'"+vm.tipomov.data.row.tipo+"'";
            vm.tipomov.data.row.child.getNumNf.functionSql(prm).then(function (numero) {
              vm.tipomov.data.row.child.data.row.numero = numero.result;
              vm.tipomov.data.row.child.data.row.status = "F";
              vm.tipomov.data.row.child.data.salvar().then(function (result) {
                if (result) {
                  //informar o id mov caso os itens nao tenha
                  for (var i = 0; i < vm.tipomov.data.row.child.data.row.child.data.rows.length; i++) {
                    vm.tipomov.data.row.child.data.row.child.data.rows[i].id_mov = vm.tipomov.data.row.child.data.row.id_mov;
                  }
                  vm.tipomov.data.row.child.data.row.child.data.aplyUpdates(false).then(function (result) {
                    if (result) {
                      //informar o id_mov nos recebimentos
                      for (var i = 0; i < vm.pdv.data.row.child.data.row.child.data.rows.length; i++) {
                        vm.pdv.data.row.child.data.row.child.data.rows[i].id_mov = vm.tipomov.data.row.child.data.row.id_mov;
                      }
                      //salvar os recebimentos
                      vm.pdv.data.row.child.data.row.child.data.aplyUpdates(false).then(function (result) {
                        var prm = {
                          templateUrl: 'app/sistema/automacao/movestoque/templates/mov-fecha-venda.html',
                          size:'',
                          data:vm.tipomov.data.row.child,
                          backdrop:'static',
                          fullscreen:false,
                          modal:{},
                        };
                        vm.tipomov.data.showModal(prm).then(function (result) {
                          vm.limparDados();
                          vm.setModosPdv(0);
                          vm.loadQtPedidos();
                        });
                      });
                    }
                  });
                }
              });
            });
          }

          vm.startTimeLoadPed = function () {
            vm.timeLoadPed = setInterval(vm.loadQtPedidos,300000);
          }

          vm.endTimeLoadPed = function () {
            clearInterval(vm.timeLoadPed);
          }

          vm.loadQtPedidos = function () {
            vm.tipomov.qtMovsOnTipo('P').then(function (result) {
              vm.pedido = result;
            });
          }

          vm.loadPedidos = function () {
            var config = {
              templateUrl: 'app/sistema/automacao/pdv/templates/pdv-select-ped.html',
              size:'',
              data:vm.tipomov.data.row.child,
              backdrop:true,
              fullscreen:false,
              modal:{},
            };
            vm.tipomov.data.row.child.data.showModal(config).then(function (result) {
              if (result) {
                result.status         = 'A';
                result.desc_status    = 'ABERTO';
                result.desc_tipo_mov  = vm.tipomov.data.row.descricao;
                result.tipo_mov       = vm.tipomov.data.row.tipo;
                result.id_tipo_mov    = vm.tipomov.data.row.id_tipo_mov;
                vm.tipomov.data.row.child.alterar(result);
                vm.setFocusCodBarras();
              }
            });
          }

          vm.sair = function () {
            if (!vm.tipomov.data.row.child.data.row) {
              vm.endTimeLoadPed();
              $state.go('layout');
            }
          }

          vm.setFocusCodBarras = function (imediato) {
            if (vm.modoPdv==0&&imediato) {
              document.getElementById('cod-barras').focus();
              document.getElementById('cod-barras').select();
            } else {
              var focus = function () {
                document.getElementById('cod-barras').focus();
                document.getElementById('cod-barras').select();
              }
              setTimeout(focus,500);
            }
          }

          vm.setFocusCabecario = function () {
            var focus = function () {
              document.getElementById('btn-rec').focus();
            }
            setTimeout(focus,500);
          }

          vm.setFocusQt = function () {
            var focus = function () {
              document.getElementById('qt').focus();
              document.getElementById('qt').select();
            }
            setTimeout(focus,200);
          }

          vm.setFocusDesc = function () {
            var focus = function () {
              document.getElementById('desc_perc').focus();
              document.getElementById('desc_perc').select();
            }
            setTimeout(focus,500);
          }


          vm.onKeyEnter = function (ev,funcao,prm) {
            var keyCode = ev.which || ev.keyCode;
            if (keyCode === 13) {
              switch (funcao){
                case 'informaItem':
                  if (vm.tipomov.data.row.child.data.row) {
                    if (!vm.itens.item.row) {
                      vm.informaItem(ev);
                    }
                  } else {
                    if (vm.modoPdv==0) {
                      if (vm.pdv.data.row.child.data.row.status =='A') {
                        if (isset(vm.pdv.data.userLogado.id_vendedor)) {
                          vm.abreVenda().then(function () {
                            vm.informaItem(ev);
                          });
                        } else {
                          logger.warning('A venda não pode ser iniciada porque o usuário responsavel não está configurado como vendedor.');
                        }
                      }
                    }
                  }
                break;
                case 'novoItem':
                  if (vm.tipomov.data.row.child.data.row.status =='A') {
                    vm.novoItem(prm);
                  }
                break
                case 'consultaItem':
                  vm.consultaItem(ev).then(function (result) {
                    vm.setFocusCodBarras();
                  });
                break;
              }
            }
          }

          vm.onKeydown = function (ev) {
            var keyCode = ev.which || ev.keyCode;
            //alert(keyCode);
            switch(keyCode){
              case 38:
                if (vm.tipomov.data.row.child.data.row.child&&vm.activeCancelItem) {
                  vm.tipomov.data.row.child.data.row.child.data.keyDownPress(ev);
                }
              break;
              case 40:
                if (vm.tipomov.data.row.child.data.row.child&&vm.activeCancelItem) {
                  vm.tipomov.data.row.child.data.row.child.data.keyDownPress(ev);
                }
              break;
              case 45:
                //Abre Venda Ins
                if (vm.pdv.data.row.child.data.row.status =='A') {
                  vm.abreVenda();
                } else {
                  vm.abreCaixa();
                }
                
              break;
              case 113:
                //consulta F2
                if (vm.modoPdv==0) {
                  vm.setModosPdv(1);
                } else {
                  vm.setModosPdv(0);
                }
              break;
              case 120:
                //pedido ou cliente F9
                if (vm.tipomov.data.row.child.data.row) {
                  if (vm.modoPdv==0) {
                    vm.informaCliente();
                  } else if (vm.modoPdv==2) {
                    //desconto
                    vm.desconto();
                  }
                } else {
                  //pedido
                  vm.loadPedidos();
                }
              break;
              case 115:
                if (vm.tipomov.data.row.child.data.row) {
                  //cancelar venda F4
                  vm.cancelaVenda(ev);
                } else {
                  //fecha caixa F4
                  if (vm.pdv.data.row.child.data.row.status =='A') {
                    vm.fechaCaixa();
                  }
                }

              break;
              case 46:
                //cancelar item del
                vm.cancelarItem();
              break;
              case 118:
                //F7 Fechar venda
                if (vm.modoPdv==0) {
                  vm.fechaVenda();
                } else if (vm.modoPdv==2) {
                  vm.recebimentos();
                }
              break;
              case 121:
              //F10
                if (vm.modoPdv==2) {
                  if (vm.totalizacao.totalRec()>=vm.totalizacao.totalVenda()) {
                    vm.concluirVenda();
                  }
                } else if (vm.modoPdv==0) {
                  vm.alterarTabela();
                }
              break;
            }

          }

          vm.setModosPdv = function (mod) {
            vm.modoPdv = mod;
            vm.itens.item.row = null;
            if (mod in [0,1]) {
              vm.setFocusCodBarras();
            } else {
              vm.setFocusCabecario();
            }
          }

        }
    }
})();

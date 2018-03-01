(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('RegistroFuncService', RegistroFuncService);

    RegistroFuncService.$inject = [
      'UtilsFunctions','EmpresaFuncService','PessoaFuncService','FilialFuncService','PerfilFuncService','ModulosFuncService','TabelaFuncService',
      'TabPrazosFuncService','VendedorFuncService','ClienteFuncService','MeioPagFuncService','TipoMovFuncService','UsuarioFuncService',
      '$state','$mdDialog','$filter','logger'
    ];

    /* @ngInject */
    function RegistroFuncService(
      UtilsFunctions,EmpresaFuncService,PessoaFuncService,FilialFuncService,PerfilFuncService,ModulosFuncService,TabelaFuncService,
      TabPrazosFuncService,VendedorFuncService,ClienteFuncService,MeioPagFuncService,TipoMovFuncService,UsuarioFuncService,
      $state,$mdDialog,$filter,logger
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;

          // função utilizada para cadastrar uma nova empresa no banco de dados
          // alem de cadatrar realizar outros cadastros que são padrao para o sistema
          // facilitando o uso do sistema e evitando algumas possiveis falha por falta de algum cadastro
          // 
          // 
          
          vm.getPessoa = function (id_empresa,form) {
            var pessoa = {
              id_empresa  : id_empresa,
              nome_comp   : form.razao,
              nome_red    : "Sua Empresa",
              tipo        : "J",
              cpf_cnpj    : form.cpf_cnpj,
              rg          : "000000",
              uf          : " ",
              cidade      : form.cidade,
              bairro      : "Bairro da empresa",
              logradouro  : form.endereco,
              numero      : "0",
              complemento : " ",
              cep         : "00000-000",
              email       : form.email,
            };
            return pessoa;
          }

          vm.getFilial = function (id_empresa,id_pessoa) {
            var filial = {
              id_empresa  : id_empresa,
              id_pessoa   : id_pessoa,
              status      : 1,
            };
            return filial;
          }

          vm.getPerfil = function (id_empresa) {
            var perfil = {
              id_empresa : id_empresa,
              nome       : 'ADMINISTRADOR',
            };
            return perfil;
          }

          vm.getPerfilMod = function (id_perfil) {
            var perfil_modulos = [
              {id_modulo : 1,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 2,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 3,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 4,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 5,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 6,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 7,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 8,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 9,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 10,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 11,permitido : 1,id_perfil : id_perfil},
              {id_modulo : 12,permitido : 1,id_perfil : id_perfil}
            ];
            return perfil_modulos;
          }

          vm.getTabela = function (id_empresa) {
            var tabela = {
              id_empresa : id_empresa,
              descricao  : 'VAREJO',
              tipo       : 'V'
            };
            return tabela;
          }

          vm.getTabPrazo = function (id_tabela) {
            var tabela_prazo = {
              id_tabela  : id_tabela,
              descricao  : 'PADRÃO',
              percentual : 50
            };
            return tabela_prazo;
          }

          vm.getPessoaVend = function (id_empresa) {
            var pessoa_vendedor = {
              id_empresa  : id_empresa,
              nome_comp   : "Nome do Vendedor",
              nome_red    : "Vendedor",
              tipo        : "F",
              cpf_cnpj    : "000.000.000-00",
              rg          : "000000",
              uf          : " ",
              cidade      : "Nome da Cidade",
              bairro      : "Bairro do vendedor",
              logradouro  : "Endereço do vendedor",
              numero      : "0",
              complemento : " ",
              cep         : "00000-000",
              email       : " ",
            };
            return pessoa_vendedor;
          }

          vm.getVendedor = function (id_pessoa_vendedor) {
            var vendedor = {
              id_pessoa : id_pessoa_vendedor,
              status    : 1
            };
            return vendedor;
          }

          vm.getPessoaCli = function (id_empresa,form) {
            var pessoa_cliente = {
              id_empresa  : id_empresa,
              nome_comp   : "CONSUMIDOR NO BALCÃO",
              nome_red    : "CONSUMIDOR",
              tipo        : "F",
              cpf_cnpj    : "000.000.000-00",
              rg          : "000000",
              uf          : " ",
              cidade      : form.cidade,
              bairro      : "Bairro da empresa",
              logradouro  : form.endereco,
              numero      : "0",
              complemento : " ",
              cep         : "00000-000",
              email       : " ",
            };
            return pessoa_cliente;
          }

          vm.getCliente = function (id_pessoa_cliente) {
            var cliente = {
              id_pessoa      : id_pessoa_cliente,
              status         : 1,
              limite_credito : 0,
            };
            return cliente;
          }

          vm.getMeioPag = function (id_empresa) {
            var meio_pag = [
              {id_empresa : id_empresa,descricao  : 'DINHEIRO'},
              {id_empresa : id_empresa,descricao  : 'CARTÃO DEBITO'},
              {id_empresa : id_empresa,descricao  : 'CARTÃO DE CREDITO'},
              {id_empresa : id_empresa,descricao  : 'CHEQUE'}
            ];
            return meio_pag;
          }

          vm.getTipoMovPad = function (id_empresa) {
            var tipo_mov_estoque_pad = {
              id_empresa   : id_empresa,
              descricao    : 'VENDAS',
              tipo         : 'S',
              status       : 1,
              mov_estoque  : 1,
              alt_cad_item : 0,
            };
            return tipo_mov_estoque_pad;
          }

          vm.getTipoMov = function (id_empresa) {
            var tipo_movs = [
              {
                id_empresa   : id_empresa,
                descricao    : 'COMPRAS',
                tipo         : 'E',
                status       : 1,
                mov_estoque  : 1,
                alt_cad_item : 1,
              },
              {
                id_empresa   : id_empresa,
                descricao    : 'PRE-VENDA',
                tipo         : 'P',
                status       : 1,
                mov_estoque  : 0,
                alt_cad_item : 0,
              }
            ];
            return tipo_movs;
          }

          vm.getUsuario = function (id_empresa,form,id_perfil,id_vendedor,id_filial) {
            var usuario = {
              id_empresa  : id_empresa,
              nome        : form.nome,
              email       : form.email,
              id_perfil   : id_perfil,
              id_vendedor : id_vendedor,
              id_filial   : id_filial,
              status      : 1
            };
            return usuario;
          }

          vm.registrarEmp = function (form) {
            //sequencia de tabelas a ser populadas:
            // Empresa
            // pessoa
            // Filial
            // perfil
            // perfil_modulos
            // tabela
            // tabela_prazo
            // pessoa_vendedor
            // vendedor
            // pessoa_cliente consulmidor padrão
            // cliente
            // meio_pag
            // tipo_mov_estoque
            // usuario
            // 
            // validar os campos do formulario
            
            if (isset(form.razao)&&isset(form.cpf_cnpj)&&isset(form.endereco)&&isset(form.nome)&&isset(form.email)) {

              var id_empresa = undefined;
              var empresa = {
                nome        : form.razao,
                cpf_cnpj    : form.cpf_cnpj,
                endereco    : form.endereco,
                cidade      : form.cidade,
                responsavel : form.nome,
                email       : form.email,
                status      : 1,
                slogan      : "Slogan da empresa",
                fantasia    : "Sua Empresa",
                config_n_nf : 0,
              };

              //inserir dados da empresa
              vm.dataEmp = new EmpresaFuncService.funcoes();
              vm.dataEmp.data.novo(empresa);
              vm.dataEmp.data.salvar().then(function (resultEmp) {
                if (resultEmp) {
                  //identifica o id da empresa
                  vm.dataPes = new PessoaFuncService.funcoes();
                  vm.dataPes.pessoa.row = vm.getPessoa(vm.dataEmp.data.row.id_empresa,form);
                  vm.dataPes.pessoa.salvar().then(function (resultPes) {
                    if (resultPes) {
                      vm.dataFil = new FilialFuncService.funcoes();
                      vm.dataFil.data.row = vm.getFilial(vm.dataEmp.data.row.id_empresa,vm.dataPes.pessoa.row.id_pessoa);
                      vm.dataFil.data.salvar().then(function (resultFil) {
                        if (resultFil) {
                          vm.dataPerf = new PerfilFuncService.funcoes();
                          vm.dataPerf.perfil.row = vm.getPerfil(vm.dataEmp.data.row.id_empresa);
                          vm.dataPerf.perfil.salvar().then(function (resultPerf) {
                            if (resultPerf) {
                              vm.dataMod = new ModulosFuncService.funcoes();
                              var perfil_modulos = vm.getPerfilMod(vm.dataPerf.perfil.row.id_perfil)
                              for (var i = 0; i < perfil_modulos.length; i++) {
                                vm.dataMod.data.adicionar(perfil_modulos[i]);
                              }
                              vm.dataMod.data.aplyUpdates(false).then(function (resultMod) {
                                if (resultMod) {
                                  vm.dataTab = new TabelaFuncService.funcoes();
                                  vm.dataTab.data.row = vm.getTabela(vm.dataEmp.data.row.id_empresa);
                                  vm.dataTab.data.salvar().then(function (resultTab) {
                                    if (resultTab) {
                                      vm.dataTabPrz = new TabPrazosFuncService.funcoes();
                                      vm.dataTabPrz.data.row = vm.getTabPrazo(vm.dataTab.data.row.id_tabela);
                                      vm.dataTabPrz.data.salvar().then(function (resultTabPrz) {
                                        if (resultTabPrz) {
                                          vm.dataPesVen = new PessoaFuncService.funcoes();
                                          vm.dataPesVen.pessoa.row = vm.getPessoaVend(vm.dataEmp.data.row.id_empresa);
                                          vm.dataPesVen.pessoa.salvar().then(function (resultPesVen) {
                                            if (resultPesVen) {
                                              vm.dataVen = new VendedorFuncService.funcoes();
                                              vm.dataVen.data.row = vm.getVendedor(vm.dataPesVen.pessoa.row.id_pessoa);
                                              vm.dataVen.data.salvar().then(function (resultVen) {
                                                if (resultVen) {
                                                  vm.dataPesCli = new PessoaFuncService.funcoes();
                                                  vm.dataPesCli.pessoa.row = vm.getPessoaCli(vm.dataEmp.data.row.id_empresa,form);
                                                  vm.dataPesCli.pessoa.salvar().then(function (resultPesCli) {
                                                    if (resultPesCli) {
                                                      vm.dataCli = new ClienteFuncService.funcoes();
                                                      vm.dataCli.cliente.row = vm.getCliente(vm.dataPesCli.pessoa.row.id_pessoa);
                                                      vm.dataCli.cliente.salvar().then(function (resultCli) {
                                                        if (resultCli) {
                                                          vm.dataMp = new MeioPagFuncService.funcoes();
                                                          vm.dataMp.data.setForengKey(vm.dataEmp.data.row.id_empresa,0);
                                                          var meio_pag = vm.getMeioPag(vm.dataEmp.data.row.id_empresa);
                                                          for (var i = 0; i < meio_pag.length; i++) {
                                                            vm.dataMp.data.adicionar(meio_pag[i]);
                                                          }
                                                          vm.dataMp.data.aplyUpdates(false).then(function (resultMp){
                                                            if (resultMp) {
                                                              vm.dataTMov = new TipoMovFuncService.funcoes();
                                                              vm.dataTMov.data.row = vm.getTipoMovPad(vm.dataEmp.data.row.id_empresa);
                                                              vm.dataTMov.data.salvar().then(function (resultTMov){
                                                                if (resultTMov) {
                                                                  vm.dataTMovs = new TipoMovFuncService.funcoes();
                                                                  vm.dataTMovs.data.setForengKey(vm.dataEmp.data.row.id_empresa,0);
                                                                  var tipo_movs = vm.getTipoMov(vm.dataEmp.data.row.id_empresa)
                                                                  for (var i = 0; i < tipo_movs.length; i++) {
                                                                    vm.dataTMovs.data.adicionar(tipo_movs[i]);
                                                                  }
                                                                  vm.dataTMovs.data.aplyUpdates(false).then(function (resultTmovs){
                                                                    if (resultTmovs) {
                                                                      vm.dataUser = new UsuarioFuncService.funcoes();
                                                                      vm.dataUser.dados.row = vm.getUsuario(vm.dataEmp.data.row.id_empresa,form,vm.dataPerf.perfil.row.id_perfil,vm.dataVen.data.row.id_vendedor,vm.dataFil.data.row.id_filial);
                                                                      vm.dataUser.dados.row.senha = vm.dataUser.gerarSenha();
                                                                      vm.dataUser.dados.actionRow = 'create';
                                                                      vm.dataUser.salvarUsuario().then(function (resultUser) {
                                                                        if (resultUser) {

                                                                          //atualizar as configurações da empresa
                                                                          vm.dataEmp.data.row.config_id_tp_padrao = vm.dataTabPrz.data.row.id_tp;
                                                                          vm.dataEmp.data.row.config_id_tipo_mov_ven_cons = vm.dataTMov.data.row.id_tipo_mov;
                                                                          vm.dataEmp.data.row.config_id_pessoa_cons = vm.dataPesCli.pessoa.row.id_pessoa;
                                                                          vm.dataEmp.data.salvar().then(function (resultEmp2){
                                                                            if (resultEmp2) {
                                                                              vm.cadastrado = true;
                                                                            }
                                                                          });
                                                                        }
                                                                      });
                                                                    }
                                                                  });
                                                                }
                                                              });
                                                            }
                                                          });
                                                        }
                                                      });
                                                    }
                                                  });
                                                }
                                              });
                                            }
                                          });
                                        }
                                      });
                                    }
                                  })
                                }
                              });

                            }
                          });
                        }
                      });
                    }
                  });
                }
              });

            } else {
              logger.warning('Preencha todos os campos do formulário!');
            }

          }


        }
    }
})();

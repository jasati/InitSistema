(function() {
    'use strict';
    angular
        .module('cad.usuario')
        .service('UsuarioFuncService', UsuarioFuncService);
    UsuarioFuncService.$inject = [
      'Dataset',
      'UtilsFunctions',
      '$state','$cookies','$q','logger','$mdPanel','$mdMedia',
      'UtilsDataFunctionService',
      'PerfilFuncService',
      'config'
    ];
    /* @ngInject */
    function UsuarioFuncService(
      Dataset,
      UtilsFunctions,
      $state,$cookies,$q,logger,$mdPanel,$mdMedia,
      UtilsDataFunctionService,
      PerfilFuncService,
      config
    ) {
      this.funcoes = funcoes;
      ////////////////
      function funcoes() {
      	var func = this;
      	var isset = UtilsFunctions.isset;
      	var dataSetProvider = Dataset.usuario();
        var datasetPerfil = Dataset.perfil();
        func.dados = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
      	func.soma = UtilsFunctions.soma;
      	func.convDate = UtilsFunctions.convDate;
        func.title = 'Cadastro de usuários';
    		func.logando = false;
        func.userLogado = dataSetProvider.provider.getSessaoUsuario();
        func.alterarSenha = {
          senhaInvalida : false,
          oldSenha : '',
          newSenha : '',
          repSenha : '',
        }

    		func.filtrar = function () {
    			var query = '';
    			if (isset(func.fieldsQry.id_usuario)) {
    				query += " and u.id_usuario = "+func.fieldsQry.id_usuario;
    			}
    			if (isset(func.dados.filtros.mainField)) {
    				query += " and u.nome LIKE '%"+func.dados.filtros.mainField+"%'";
    			}
          func.dados.read(query);

    		}

    		func.activate = function() {
	            var promises = [func.setFieldsQry()];
	            $q.all(promises);
    		}

    		func.login = function () {
    			var dts = func.dados.getDataset(true);
    			var query = '';
    			if (isset(func.fieldsQry.id_usuario)) {
    				query += " and u.id_usuario = "+func.fieldsQry.id_usuario;
    			} else {
    				query += " and email = '"+func.fieldsQry.email+"' and senha = '"+func.fieldsQry.senha+"'";
    			}
          //seta o valor 1 para possibilitar fazer o login em qualquer empresa, so dependendo do email e senha
          dataSetProvider.provider.setValor(dts,'id_index_main','1');
    			dataSetProvider.provider.setValor(dts,'valor_id_main','1');
    			dataSetProvider.provider.setValor(dts,'consulta',query);
    			dataSetProvider.provider.setValor(dts,'limit',func.dados.getLimite());
    			var post = {
    				dataSet:dts,
    				msgErro:'Falha ao Realizar o Login',
    				msgSucess:'',
    			};
    			dataSetProvider.api.read(post).then(function (resp) {
            var loadModulos = function (usuario) {
              var datasetModulos = Dataset.perfilModulos()
              var modulosPerfil = new UtilsDataFunctionService.dataFuncoes(datasetModulos);
              var qry = ' and pm.id_perfil = '+usuario.id_perfil+' and pm.permitido = 1 ';
              return modulosPerfil.read(qry,false).then(function (resMod) {
                return resMod;
              });
            }
    				if (isset(resp.reg.length)) {//verifica se tem registros
                if (resp.reg.length > 0) {
        					var usuario = resp.reg[0];
        					if (usuario.status == 1) {//verifica se o usuario esta ativo
                    var sessao = {
                      usuario:usuario,
                      empresa:{
                        id_empresa:usuario.id_empresa,
                      }
                    };
                    startSession(sessao);
                    loadModulos(usuario).then(function (resMod) {
                      dataSetProvider.provider.setPermissoes(resMod.reg);
                      $state.go('layout');
                    });
        					} else {
                    logger.info('Esse usuário está desativado, Entre em contato com o administrador.');
                    func.usuario.logando = false;
    	    					if ($state.current.name !== 'login'){
    	    						$state.go('login');
    	    					}
        					}
                } else {
                    logger.warning('Usuário ou senha inválido!');
                    if ($state.current.name !== 'login'){
                        $state.go('login');
                    }
                }
    				} else {
    					if ($state.current.name !== 'login'){
    						$state.go('login');
    					}
    				}
    			});
    		}

        func.validarSenha = function (email) {
          func.alterarSenha.senhaInvalida = false;
          var dts = func.dados.getDataset(true);
          var query = " and email = '"+email+"' and senha = '"+func.alterarSenha.oldSenha+"'";
          dataSetProvider.provider.setValor(dts,'consulta',query);
          var post = {
            dataSet:dts,
            msgErro:'Falha ao validar a senha.',
            msgSucess:'',
          };
          dataSetProvider.api.read(post).then(function (resp) {
            if (isset(resp.reg.length)) {
              if (resp.reg.length > 0) {
                //alterar a senha
                var user = resp.reg[0];
                user.senha = func.alterarSenha.newSenha;
                func.dados.alterar(user);
                func.dados.salvar().then(function (result) {
                  if (result) {
                    func.alterarSenha.senhaAlterada = true;
                  }
                });
              } else {
                func.alterarSenha.senhaInvalida = true;
              }
            }
          });
        }

        function gerarSenha() {
            var dt = new Date();
            var senha = dt.getDate()+dt.getTime();
            var mensx="";
            var l="";
            var i;
            var j=0;
            var ch;
            senha = senha.toString();
            ch = "assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm!@#$%&*()_-=+9876543210:;>.<,|}^]{[/?HhGgFfDdSsMm";
            for (i=0;i<senha.length; i++){
                l+=senha.substr(i,1);
                j++;
                if (j==2) {
                    l=Number(l);
                    mensx+=ch.substr(l,1);
                    j=0;
                    l="";
                }
            }
            return mensx;
        }

        function enviarSenhaEmail(user) {
            var msg =
                "<h1>Bem vindo ao Ecc WebApp <small>Sistema on-line para gerenciamento de ECC</small></h1>"+
                "<h3>Abaixo esta os dados para acesso ao sistema</h3>"+
                "<p><b>Link para acessar o sistema : </b><a href='"+config.urlSistema+"'>Click Aqui</a></p>"+
                "<p><b>Login : </b>"+user.email+"</p>"+
                "<p><b>Senha : </b> "+user.senha+"</p>";

            var email = {
                email:user.email,
                assunto:'Acesso ao Ecc WebApp',
                mensagem:msg,
                head_from:'appecc@pibdecoite.com.br',
            }
            return func.dados.enviarEmail(email).then(function (res) {
                return res;
            });
        }

        func.fazerLogin = function () {
            if ($cookies.get('idUser')) {
                func.fieldsQry.id_usuario = $cookies.get('idUser');//getUserLogado('idUser')
                func.login();
            } else {
                $state.go('login');
            }
        }

    		var startSession = function (sessao) {
          $cookies.put('nomeUser',sessao.usuario.nome);
          $cookies.put('idUser',sessao.usuario.id_usuario);
          $cookies.put('idEmp',sessao.usuario.id_empresa);
          dataSetProvider.provider.setPubId(sessao.usuario.id_empresa)
          dataSetProvider.provider.setSessaoEmpresa(sessao.empresa);
          dataSetProvider.provider.setSessaoUsuario(sessao.usuario);
    		}

    		func.endSession = function () {
          $cookies.remove('nomeUser');
          $cookies.remove('idUser');
          $cookies.remove('idEmp');
          dataSetProvider.provider.finishSessao();
          $state.go('login');
    		}


    		func.setFieldsQry = function () {
    			func.fieldsQry = {
    				id_usuario : '',
    				nome       : '',
    				codigo     : '',
    				email      : '',
    				senha      : '',
    				status     : 1,
    			};
    		}

        func.ativaPerfil = function () {
          if (!isset(func.perfils)) {
            func.perfils = new PerfilFuncService.funcoes();
            func.perfils.startFiltro();
          }
        }
        func.showTable = function () {
          $state.go('layout.ctrlAcesso.usuarios');
        }

        func.salvarUsuario = function () {
          if (func.dados.actionRow == 'create') {
            func.dados.salvar().then(function (result) {
              if (result) {
                enviarSenhaEmail(func.dados.row).then(function (result) {
                  logger.success('Email com os dados de acesso foi enviado para '+func.dados.row.email);
                });
              }
            });
          } else {
            func.dados.salvar();
          }
        }
        func.cadastro = function (action,row,parent) {
          switch (action) {
            case 'create':
              row.senha = gerarSenha();
              func.dados.novo(row);
              break;
            case 'update':
              func.dados.alterar(row);
              break;
          }
          func.ativaPerfil();
          var prm = {
            templateUrl: 'app/cadastros/usuario/templates/usuario-cadastro.html',
            ariaLabelledBy: 'Usuario',
            ariaDescribedBy: 'Usuario-modal',
            size:'',
            data:func,
            backdrop:'static',
            fullscreen:false,
            modal:{},
          };
          return func.dados.showModal(prm,parent).then(function (data) {
            return data
          });
        }
        func.deletar = function (ev,data) {
          func.dados.confirmDel(ev,data.nome).then(function (result) {
            if (result) {
              func.dados.deletar([data]).then(function (deletado) {
                if (deletado) {
                  func.filtrar();
                }
              });
            }
          });
        }

        /*executar ao instanciar*/
        func.activate();

      }
    }
})();

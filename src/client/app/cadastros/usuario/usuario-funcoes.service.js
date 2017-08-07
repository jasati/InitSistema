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
      'PerfilFuncService'
    ];
    /* @ngInject */
    function UsuarioFuncService(
      Dataset,
      UtilsFunctions,
      $state,$cookies,$q,logger,$mdPanel,$mdMedia,
      UtilsDataFunctionService,
      PerfilFuncService
    ) {
      this.funcoes = funcoes;
      ////////////////
      function funcoes() {
      	var func = this;
      	var isset = UtilsFunctions.isset;
      	var dataSetProvider = Dataset.usuario();
        var datasetPerfil = Dataset.perfil();
        func.dados = new UtilsDataFunctionService.dataFuncoes(dataSetProvider)
        func.perfils = new UtilsDataFunctionService.dataFuncoes(datasetPerfil);
      	func.soma = UtilsFunctions.soma;
      	func.convDate = UtilsFunctions.convDate;
        func.title = 'Cadastro de usuários';
    		func.logando = false;

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
    				if (isset(resp.reg.length)) {//verifica se tem registros
                if (resp.reg.length > 0) {
        					var usuario = resp.reg[0];
        					if (usuario.status == 1) {//verifica se o usuario esta ativo
        						var sessao = {
        							usuario:usuario,
        							empresa:{
                        id_empresa:usuario.id_empresa,
                      },
        						};
        						startSession(sessao);
        						$state.go('layout');

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

        func.showTable = function () {
          $state.go('layout.ctrlAcesso.usuarios');
          func.perfils.filtrar();
        }

        func.novo = function () {
          func.dados.novo({});
          $state.go('layout.ctrlAcesso.usuarios.cad');
        }

        func.alterar = function (data) {
          func.dados.alterar(data);
          // $state.go('layout.ctrlAcesso.usuarios.cad');
        }

        /*executar ao instanciar*/
        func.activate();

      }
    }
})();

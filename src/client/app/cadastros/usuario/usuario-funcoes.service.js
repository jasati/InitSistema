(function() {
    'use strict';
    angular
        .module('cad.usuario')
        .service('UsuarioFuncService', UsuarioFuncService);
    UsuarioFuncService.$inject = ['Dataset','UtilsFunctions','$state','$cookies','$q','logger','$mdPanel','$mdMedia'];
    /* @ngInject */
    function UsuarioFuncService(Dataset,UtilsFunctions,$state,$cookies,$q,logger,$mdPanel,$mdMedia) {
        this.funcoes = funcoes;
        ////////////////
        function funcoes() {
        	var func = this;
        	var isset = UtilsFunctions.isset;
        	var dataSetProvider = Dataset.usuario();
        	func.soma = UtilsFunctions.soma;
        	func.convDate = UtilsFunctions.convDate;
            func.title = 'Cadastro de usuários';
    		func.usuarios = [];//lista com os usuarios
            func.usuario = {};//um usuario selecionado ou novo
            func.usuariosSelect = [];//usuarios selecionados
    		func.action = null;
    		func.logando = false;
    		func.salvando = false;
            func.pagination = {
                limit:5,
                pagina:1,
                total:0,
                limitOptions:[1,5,10,15],//quantidade de registro por pagina
                label:{
                    page: 'Página:', 
                    rowsPerPage: 'Registros por página:', 
                    of: 'de'
                }
            }
	        func.empresa = dataSetProvider.empresa;
            func.filtros = {
                showField:false,
                flex:'0',
                query:'',
                digitando:false,
                fields : [
                    {'field':'status','alias':'Status'},
                    {'field':'email','alias':'email'},
                    {'field':'id_usuario','alias':'Código'}
                ],
                fildsQuery:[
                    {'campo':'status','value':'1'},
                    {'campo':'email','value':'jalan.alves@gmail.com'},
                ],
                onClick:function(){
                    func.filtros.showField = !func.filtros.showField;
                    if (func.filtros.showField) {
                        func.filtros.flex = '50';
                        document.getElementById('filtro').focus();
                    } else {
                        func.filtros.flex = '0';
                        func.filtros.cleanFilter();
                    }
                },
                onChange:function () {
                    if (!func.filtros.digitando) {
                        func.filtros.digitando = true;
                        setTimeout(function(){
                            func.filtros.digitando = false;
                            func.read();
                        }, 2000);
                    }
                },
                cleanFilter:function () {
                    if (func.filtros.query != '') {
                        func.filtros.query = '';
                        func.read();
                    }
                },
                filtroAvancado:function () {
                    var panel = $mdPanel;
                    var prm = {
                        painel   : panel,
                        data     : func,
                        position : 'center',
                    };
                    var config = UtilsFunctions.getPrmPanel(prm);
                    config.templateUrl = 'app/cadastros/usuario/templates/pesquisa.html';
                    config.clickOutsideToClose = false;
                    config.hasBackdrop = true;
                    panel.open(config);
                },
                addFiltro:function (filtro) {
                    func.filtros.fildsQuery.push(filtro);
                }


            };
            func.selected = [];


    		/*CRUD*/
    		var create = function (data) {
    			//metodo privado
    			func.salvando = true;
    			data.id_empresa = dataSetProvider.empresa.id_empresa;
    			var nData = UtilsFunctions.copiarObjecto(data);
    			var dts = getDataset(false);
    			dataSetProvider.provider.setValor(dts,'estrutura',nData);
    			var post = {
    				camposInvalidos : dataSetProvider.camposInvalidos,
    				dataset         : dts,
    				msgErro         : 'Descupe, ocorreu uma falha ao salvar o usuário',
    				msgSucess       : 'Salvo com sucesso!',
    			};
    			return dataSetProvider.api.create(post).then(function (resp) {
    				func.salvando = false;
    				if (resp.status == 'ok') {
    					data.id_usuario = resp.last_insert;
    					//depois de criar marcar agora como update para não salvar duas vezes
    					func.action = 'update';
    					return true;
    				} else {
    					return false;
    				}
    			});
    		}

            function montarConsulta(campo,expr,valor) {
                var qry = " and "+campo+expr+"'"+valor+"' ";
                return qry;
            }

    		func.read = function () {
    			var dts = getDataset(true);
    			var query = '';
    			if (isset(func.fieldsQry.id_usuario)) {
    				query += " and u.id_usuario = "+func.fieldsQry.id_usuario;
    			}
    			if (isset(func.filtros.query)) {
    				query += " and u.nome LIKE '%"+func.filtros.query+"%'";
    			}

                for (var i = 0; i < func.filtros.fildsQuery.length; i++) {
                    func.filtros.fildsQuery[i]
                    query += montarConsulta(func.filtros.fildsQuery[i].campo,'=',func.filtros.fildsQuery[i].value);
                }

    			dataSetProvider.provider.setValor(dts,'consulta',query);
    			dataSetProvider.provider.setValor(dts,'limit',func.getLimite());
    			var post = {
    				dataSet:dts,
    				msgErro:'Ocorreu uma falha na busca dos usuários',
    				msgSucess:'',
    			};
    			dataSetProvider.api.read(post).then(function (resp) {
                    func.usuarios = resp.reg;
                    func.pagination.total = resp.qtde;
    			});
    		}

    		var update = function (data) {
    			//metodo privado
    			func.salvando = true;
    			var nData = UtilsFunctions.copiarObjecto(data);
    			var dts = getDataset(false);
    			dataSetProvider.provider.setDataset(dts,'estrutura',nData);
    			var post = {
    				camposInvalidos : dataSet.camposInvalidos,
    				dataset         : dts,
    				msgErro         : 'Descupe, ocorreu uma falha na alteração do usuário',
    				msgSucess       : 'Alterado com sucesso!',
    			};
    			return dataSetProvider.api.update(post).then(function (resp) {
    				func.salvando = false;
    				if (resp.status == 'ok') {
    					return true;
    				} else {
    					return false;
    				}
    			});
    		}

    		var deletar = function (data) {
    			//metodo privado
    			var dts = getDataset(false);
    			dataSetProvider.provider.setDataset(dts,'estrutura',data);
    			dataSetProvider.provider.setDataset(dts,'valor_id',data.id_usuario);
    			var post = {
    				dataset         : dts,
    				msgErro         : 'Descupe, ocorreu uma falha na exclusão do usuário',
    				msgSucess       : 'Excluido com sucesso!',
    			};
    			return dataSetProvider.api.deletar(post).then(function (resp) {
    				if (resp.status == 'ok') {
    					return true;
    				} else {
    					return false;
    				}
    			});
    		}
    		/*FIM DO CRUD*/
    		func.activate = function() {
	            var promises = [func.setFieldsQry()];
	            $q.all(promises);
    		}

    		var getDataset = function (isQuery) {
    			// metodo privado
    			var dts = dataSetProvider.provider.getPrmWebService();
    			// DataserviseProvider.setDataset(dts,'inner_join',getDataSet.inner_join);
    			// DataserviseProvider.setDataset(dts,'left_join',getDataSet.left_join);
    			// DataserviseProvider.setDataset(dts,'order by',getDataSet.orderBy);
    			// DataserviseProvider.setDataset(dts,'group by',getDataSet.groupBy);
    			// DataserviseProvider.setDataset(dts,'consulta','');
    			// DataserviseProvider.setDataset(dts,'limit','');
    			// DataserviseProvider.setDataset(dts,'estrutura','');
    			dataSetProvider.provider.setValor(dts,'campos',dataSetProvider.campos);
    			dataSetProvider.provider.setValor(dts,'id_index_main',dataSetProvider.id_index_main);
    			dataSetProvider.provider.setValor(dts,'valor_id_main',dataSetProvider.valor_id_main);
    			if (isQuery) {
    				dataSetProvider.provider.setValor(dts,'modulo',dataSetProvider.moduloQuery);
    				dataSetProvider.provider.setValor(dts,'id_tabela',dataSetProvider.id_tabelaQuery);
    			} else {
    				dataSetProvider.provider.setValor(dts,'modulo',dataSetProvider.modulo);
    				dataSetProvider.provider.setValor(dts,'id_tabela',dataSetProvider.id_tabela);
    			}
    			return dts;
    		}

    		func.login = function () {
    			var dts = getDataset(true);
    			var query = '';
    			if (isset(func.fieldsQry.id_usuario)) {
    				query += " and u.id_usuario = "+func.fieldsQry.id_usuario;
    			} else {
    				query += " and email = '"+func.fieldsQry.email+"' and senha = '"+func.fieldsQry.senha+"'";
    			}

    			dataSetProvider.provider.setValor(dts,'consulta',query);
    			dataSetProvider.provider.setValor(dts,'limit',func.getLimite());
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
        							empresa:{},
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
            func.addFiltro = function (filtro) {
                func.filtros.push(filtro)
            }


            func.painel = function () {
                var panel = $mdPanel;
                var prm = {
                    painel   : panel,
                    data     : func,
                    position : 'center',
                };
                var config = UtilsFunctions.getPrmPanel(prm);
                config.templateUrl = 'app/cadastros/usuario/templates/usuario-cadastro.html';
                config.clickOutsideToClose = false;
                config.focusOnOpen = false,
                panel.open(config);
            }

            func.mediaxs = function() {
                return $mdMedia('xs');
            }
            func.showTable = function () {
                $state.go('layout.usuario.lista');
            }

            func.novo = function () {
                $state.go('layout.usuario.cad');
            }
            func.alterar = function (data) {
                func.usuario = data;
                $state.go('layout.usuario.cad');
            }

            func.onChange = function () {
                alert('Alterou');
            }

	        func.getLimite = function() {
	            var inicio = (func.pagination.pagina - 1) * func.pagination.limit;
	            return inicio +','+func.pagination.limit;
	        }
	        func.setPage = function() {
	            func.read();
	        }

	        /*executar ao instanciar*/
	        func.activate();

        }
    }
})();
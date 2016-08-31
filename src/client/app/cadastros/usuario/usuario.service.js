(function() {
    'use strict';
    angular
        .module('cad.usuario')
        .factory('UsuarioService', UsuarioService);
    UsuarioService.$inject = ['$q','$modal','dataservice','DataserviseProvider','UtilsFunctions','PerfilService','ModPerfilService'];
    /* @ngInject */
    function UsuarioService($q,$modal,dataservice,DataserviseProvider,UtilsFunctions,PerfilService,ModPerfilService) {
        var dataset = DataserviseProvider.getPrmWebService();
        var usuarios = [];
        var perfils = [];
        var modPerfils = [];
        var camposInvalidos = [];
        var service = {
            create       : create,  
            read         : read,          
            update       : update,
            deletar      : deletar,
            usuarios     : usuarios,
            login        : login,
            getUsuario   : getUsuario,
            getPerfil    : getPerfil,
            getModPerfil : getModPerfil,
            editPerfil   : editPerfil,
            editUsuario  : editUsuario,
            cadPerfil    : cadPerfil,
            newUsuario   : newUsuario,
            verificarPermissao : verificarPermissao,
            getUserModulo : getUserModulo,
            validaSenha : validaSenha,
            atDadosLogin: atDadosLogin
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','usuarios');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_usuario');
        }

        function startDataset2() {          
            DataserviseProvider.setDataset(dataset2,'id_index_main','u.id_empresa');
            DataserviseProvider.setDataset(dataset2,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset2,'modulo','usuarios u');
            DataserviseProvider.setDataset(dataset2,'id_tabela','id_usuario');
        }        

        function read (prmConsulta,prmLimit) {
            startDataset();
            var msgErro = 'Falha na Consulta do Usuario';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.nome != ""){
                consulta += " and u.nome LIKE '%"+prmConsulta.nome+"%'";
            }
            if (prmConsulta.email != ""){
                consulta += " and u.email LIKE '%"+prmConsulta.email+"%'";
            }
            if (prmConsulta.status != ""){
                consulta += " and u.status = "+prmConsulta.status;
            }  
            if (prmConsulta.codigo != ""){
                consulta += " and u.id_usuario = "+prmConsulta.codigo;
            }              
            DataserviseProvider.setDataset(dataset,'modulo','usuarios u');
            DataserviseProvider.setDataset(dataset,'id_tabela','u.id_usuario');                     
            DataserviseProvider.setDataset(dataset,'id_index_main','u.id_empresa');            
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                    if (consulta == "") {usuarios = data;}
                	return data;
           		});            
        }

        function getUserModulo(idmod) {
            startDataset2();
            var msgErro = 'Falha na Consulta do modulo do usuario';
            var servico = 'consulta';
            var consulta = " and pm.id_modulo = "+idmod;
            DataserviseProvider.setDataset(dataset2,'consulta',consulta);   
            return dataservice.dadosWeb(dataset2,servico,msgErro)
                .then(function (data) {
                    return data;
                });            
        }

        function create (data) {
            var msgErro = 'Falha na inclusão do Usuário.';
            var msgSucess = 'Inclusão realizada com sucesso!';
            var action = 'novo';
            data.id_prefeitura = DataserviseProvider.indexGeral.id_emp;    	
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do Usuário.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_usuario);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do Usuário.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_usuario);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }

        function login(prmConsulta,prmLimit) {
            var msgErro = 'Falha ao Realizar o Login';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.id_usuario != "") {
                consulta += " and id_usuario = "+prmConsulta.id_usuario;
            } else {
                if (prmConsulta.logar == 0) {
                    consulta += " and login = '"+prmConsulta.login+"' and senha = '"+prmConsulta.senha+"'";                
                } else {
                    consulta += " and email = '"+prmConsulta.login+"' and senha = '"+prmConsulta.senha+"'";                
                } 
            }

            DataserviseProvider.setDataset(dataset,'id_index_main','1');//é um porque pode ser usuario de qualquer prefeitura
            DataserviseProvider.setDataset(dataset,'valor_id_main','1');//o mesmo
            DataserviseProvider.setDataset(dataset,'modulo','usuarios u');
            DataserviseProvider.setDataset(dataset,'id_tabela','u.id_usuario'); 
            DataserviseProvider.setDataset(dataset,'consulta',consulta);              
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
                .then(function (data) {
                    return data;
                });
        }

        function atDadosLogin(usuario) {
            var dt = new Date();
            usuario.data_acess = UtilsFunctions.formatData(dt,dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds());
            getIpAddr().then(function (result) {
                usuario.ip_acess = result.andress;
                update(usuario);
            });
        }

        function getIpAddr() {
            var msgErro = 'Falha no getIpAddr';
            var servico = 'ipaddr';
            return dataservice.dadosWeb(dataset,servico,msgErro)
                .then(function (data) {
                    return data;
                });            
        }

        function validaSenha(prmConsulta) {
            var msgErro = 'Falha ao validar a senha';
            var servico = 'consulta';
            var dst = DataserviseProvider.getPrmWebService();
            var consulta = "";
            if (prmConsulta.logar == 0) {
                consulta += " and login = '"+prmConsulta.login+"' and senha = '"+prmConsulta.senha+"'";
            } else {
                consulta += " and email = '"+prmConsulta.login+"' and senha = '"+prmConsulta.senha+"'";
            }
            DataserviseProvider.setDataset(dst,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dst,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dst,'modulo','usuarios');
            DataserviseProvider.setDataset(dst,'id_tabela','id_usuario');
            DataserviseProvider.setDataset(dst,'campos','senha');
            DataserviseProvider.setDataset(dst,'consulta',consulta);
            return dataservice.dadosWeb(dst,servico,msgErro)
                .then(function (data) {
                    return data;
                });
        }

        ///////////////////////////////

        function verificarPermissao(idMod) {
            var modulos = DataserviseProvider.userLogado.modulos
            return UtilsFunctions.permissao(modulos,idMod);
        }

        function getUsuario(consulta,limit) {
            return read(consulta,limit).then(function(data){
                var rs = {
                    reg:data['reg'],
                    qtde:data['qtde']
                }
                usuarios = rs.reg;
                return rs
            });
        } 

        function getPerfil(consulta,limit) {
            return PerfilService.read(consulta,limit).then(function(data){
                var rs = {
                    reg:data['reg'],
                    qtde:data['qtde']
                }
                perfils = rs.reg;
                return rs;
            });            
        }
        function getModPerfil(consulta,limit) {
            return ModPerfilService.read(consulta,limit).then(function(data){
                var rs = {
                    reg:data['reg'],
                    qtde:data['qtde']
                }
                modPerfils = rs.reg;
                return rs;
            });            
        }           

        function newUsuario() {
            var usuario = {};
            usuario.id_prefeitura = 0;
            var resolvers = {
                usuario:usuario,
                perfils:perfils,
                modPerfils:modPerfils
            }
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/usuario/templates/usuario-cadastro.html',
              controller: 'UsuarioModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Dados: function () {
                  return resolvers;
                }
              }              
            });
            
            return modalInstance.result.then(function (data) {
                return data;
            });
        }   

        function editUsuario(index) {
            var resolvers = {
                usuario:index,
                perfils:perfils,
                modPerfils:modPerfils
            }
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/usuario/templates/usuario-cadastro.html',
              controller: 'UsuarioModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Dados: function () {
                  return resolvers;
                }
              }              
            });
            return modalInstance.result.then(function (data) {
                return data;
            });
        }

        function editPerfil(index) {
            var resolvers = {
                usuario:index,
                perfils:perfils,
                modPerfils:modPerfils
            }
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/usuario/templates/usuario-perfil.html',
              controller: 'UsuarioModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Dados: function () {
                  return resolvers;
                }
              }              
            });
            return modalInstance.result.then(function (data) {
              return data;
            });
        }

        function deleteUsuario(index) {
            var resolvers = {
                usuario:index,
                perfils:perfils,
                modPerfils:modPerfils
            }
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/usuario/templates/delete.html',
              controller: 'UsuarioModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Data: function () {
                  return resolvers;
                }
              }
            });
            return modalInstance.result.then(function (data) {
                return data;
            });
        }

        function cadPerfil() {
            return PerfilService.cadPerfil().then(function(data){
                return data;
            });
        }        

    }
})();
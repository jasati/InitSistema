(function() {
    'use strict';
    angular
        .module('app.login')
        .directive('login', login);
    login.$inject = ['DataserviseProvider','UsuarioService', 'logger', '$cookies', 'config','EmpresaService'];
    /* @ngInject */
    function login (DataserviseProvider, UsuarioService, logger, $cookies, config,EmpresaService) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: LoginController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                'usuario': '=',
                'navline': '=',
                'logado' : '='
            },            
            templateUrl: 'app/login/login.html'
        };


	    /* @ngInject */
	    function LoginController () {
	    	var vm = this;
            vm.logar = logar;
            vm.appTitulo = config.appTitle;
            vm.appSubTitulo = config.appSubtitle;
            vm.usuario.logando = false;
            var consulta = {
                'login':"",
                'senha':"",
                'id_usuario':"",
                'logar':0 //essa informação será para 0 ser logado pelo campo login
                          //e 1 pelo campo email  
            }

            activate();

            function activate() {
                existeUserLogado();
            }

            function logar () {
                vm.usuario.logando = true;
                consulta.login = vm.usuario.login;
                consulta.senha = vm.usuario.senha;
                UsuarioService.login(consulta).then(function(data) {
                    if (data) {
                        if (data['reg'].length!==0) {//verifica se achou usuario
                            if (data['reg'][0].status == 1){ //usuario esta ativo
                                setUserLogado(data['reg'][0].nome,data['reg'][0].id_usuario,data['reg'][0].id_prefeitura);
                                DataserviseProvider.indexGeral.id_usuario = data['reg'][0].id_usuario;
                                DataserviseProvider.indexGeral.id_emp = data['reg'][0].id_empresa;
                                vm.usuario = data['reg'][0];
                                DataserviseProvider.userLogado.usuario = vm.usuario;
                                var cons={id_perfil:vm.usuario.id_perfil};
                                UsuarioService.getModPerfil(cons).then(function(data){
                                    DataserviseProvider.userLogado.modulos = data['reg'];
                                });
                                EmpresaService.load().then(function (pref) {
                                    DataserviseProvider.userLogado.prefeitura = pref['reg'][0];
                                    UsuarioService.atDadosLogin(vm.usuario);
                                });
                            } else {
                                logger.info('Descupe! seu cadastro está desativado, Entre em contato com o administrador.');
                            }
                        } else {
                            logger.warning("Usuário ou senha inválidos.");
                            consulta == '';
                        }
                    } else {
                        logger.error('O servidor não retornou os dados solicitado.');
                    }
                });
            }  

            // function prmWeb() {          
            //     DataserviseProvider.setDataset(dataset,'id_index_main','1');//é um porque pode ser usuario de qualquer prefeitura
            //     DataserviseProvider.setDataset(dataset,'valor_id_main','1');//o mesmo
            //     DataserviseProvider.setDataset(dataset,'modulo','usuarios');
            //     DataserviseProvider.setDataset(dataset,'id_tabela','id_usuario');              
            // } 

            function existeUserLogado () {
                if (getUserLogado('idUser')) {
                    consulta.id_usuario = getUserLogado('idUser');
                    logar();
                    return true;
                } else {
                    return false;
                }
            } 

            function setUserLogado (nome,id,id_emp) {
                $cookies['nomeUser'] = nome;
                $cookies['idUser'] = id;
                $cookies['idEmp'] = id_emp;
                vm.logado = true;
            }

            function getUserLogado (prm) {
                 return $cookies[prm];
            }
           
	    }  
	          
        return directive;
    }

})();
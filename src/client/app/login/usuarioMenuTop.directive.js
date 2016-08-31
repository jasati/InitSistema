
(function() {
    'use strict';
    angular
        .module('app.login')
        .directive('usuarioMenuTop', usuarioMenuTop);
    usuarioMenuTop.$inject = ['$q','DataserviseProvider', '$cookies', '$modal', 'dataservice', 'UsuarioService'];
    /* @ngInject */
    function usuarioMenuTop ($q,DataserviseProvider, $cookies, $modal, dataservice, UsuarioService) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: UsuarioMenuTopController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
            	'usuario':'=',
            	'logado': '='
            },
            templateUrl: 'app/login/usuario-menu-top.html'
        };



        function UsuarioMenuTopController () {
            var vm = this;

            vm.logoff = logoff;
            vm.cadastroUsuarioLogado = cadastroUsuarioLogado;
            vm.alterarSenha = alterarSenha;
 
            //activate();
            function activate() {
                var promises = []
                $q.all(promises);
            }



            function logoff () {
                delete($cookies['nomeUser']);
                delete($cookies['idUser']);
                delete($cookies['idEmp']);
                DataserviseProvider.indexGeral.id_usuario = '';
                DataserviseProvider.indexGeral.id_emp = '';
                vm.logado = false;
                vm.usuario = {};
                location.reload();

            }

            function cadastroUsuarioLogado () {
              UsuarioService.editPerfil(vm.usuario).then(function (save){
                UsuarioService.update(save);
              })
            }

            function alterarSenha () {
                var modalInstance = $modal.open({
                  templateUrl: 'app/cadastros/usuario/templates/usuario-alterar-senha.html',
                  controller: 'UsuarioModalController',
                  controllerAs: 'vm',
                  size: 'sm',
                  backdrop:true,
                  resolve: {
                    Dados: function () {
                      return {usuario:vm.usuario};
                    }
                  }
                });
	            modalInstance.result.then(function (save) {
                    UsuarioService.update(save);
	            });
            }

	        function prmWeb() {          
	            DataserviseProvider.configPrmWebService('id_index_main','id_emp');
	            DataserviseProvider.configPrmWebService('valor_id_main','1');
	            DataserviseProvider.configPrmWebService('modulo','usuarios');
	            DataserviseProvider.configPrmWebService('id_tabela','id_usuario');              
	        }

        }


        return directive;
    }
})();
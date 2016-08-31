(function(){
    'use strict';

    angular
        .module('cad.usuario')
        .controller('UsuarioModalController', UsuarioModalController);
    UsuarioModalController.$inject = ['$q','Dados','$scope', '$modalInstance','UsuarioService'];
    /* @ngInject */
    function UsuarioModalController($q,Dados, $scope, $modalInstance,UsuarioService) {
        var vm = this;
        vm.title = 'Cadastro Usuario';
        vm.usuario = Dados.usuario;
        vm.perfils = Dados.perfils;
        vm.secretarias = Dados.secretarias;
        vm.modPerfils = Dados.modPerfils;
        vm.optnivel = [
            {valor:0,descricao:'Administrador'},
            {valor:1,descricao:'Usuário'}
        ]
        vm.senha = {
            oldsenha : '',
            newsenha : '',
            rsenha : ''
        };
        vm.senhaInvalida = false;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.validaSenha = validaSenha;
        vm.getModPerfil = getModPerfil;

        
        ////////////

        activate();

        function activate() {
            var promises = [getModPerfil(vm.usuario.id_perfil)];
            return $q.all(promises).then(function() {
            });            
            
        }
        function validaSenha(senha){
            var prm = {
                logar:0,
                login:vm.usuario.login,
                senha:senha.oldsenha
            }
            UsuarioService.validaSenha(prm).then(function (user) {
                if (senha.oldsenha == user['reg'][0].senha) {
                    vm.usuario.senha = senha.newsenha;
                    ok(vm.usuario);
                } else {
                    vm.senhaInvalida = true;
                }                
            })

        }
        function getModPerfil(perfil) {
            if (perfil) {
                var cons = {id_perfil:perfil}
                UsuarioService.getModPerfil(cons).then(function(data){
                  vm.modPerfils = data.reg;
                });          
            }  
        }
        function ok(save) {
        	$modalInstance.close(save);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }
    }
})();
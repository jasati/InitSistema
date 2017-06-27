(function() {
    'use strict';
    angular
        .module('app.login')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$q','UsuarioFuncService'];
    /* @ngInject */
    function LoginController($q,UsuarioFuncService) {
    	var vm = this;
        vm.login = new UsuarioFuncService.funcoes();

    }
})();
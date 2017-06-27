(function() {
    'use strict';

    angular
        .module('app.start')
        .controller('StartController', StartController);

    StartController.$inject = ['$stateParams','$state','config','UtilsFunctions','UsuarioFuncService'];
    /* @ngInject */
    function StartController($stateParams,$state,config,UtilsFunctions,UsuarioFuncService) {
        var vm = this;
        var isset = UtilsFunctions.isset;

        activate();

        function activate() {
            if ($stateParams.register) {
                $state.go('registrar',{email:$stateParams.email});
            } else {
                if (isset(config.dbase)) {
                    var login = new UsuarioFuncService.funcoes();
                    login.fazerLogin();
                } else {
                    $state.go('layout');
                }
            }
        }
    }
})();

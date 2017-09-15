(function() {
  'use strict';

  angular
  .module('app.start')
  .controller('StartController', StartController);

  StartController.$inject = ['$filter','$http','$stateParams','$state','logger','config','UtilsFunctions','UsuarioFuncService'];
  /* @ngInject */
  function StartController($filter,$http,$stateParams,$state,logger,config,UtilsFunctions,UsuarioFuncService) {
    var vm = this;
    var isset = UtilsFunctions.isset;

    activate();

    function activate() {
      getSistema()
    }

    function rotaInicial() {
      if ($stateParams.externo) {
        $state.go($stateParams.externo);
      } else if ($stateParams.register) {
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
    function getSistema() {
      $http({method: 'GET',url: 'app/sistema/sistemas.json'}).then(function (result) {
        //informe o nome do sistema que será compilado
        /*
          psicanalise
        */
        var nomeSistem = 'psicanalise'
        var ambiente = 0; //0 = local 1 = producao
        var filtro = $filter('filter')(result.data,{sistema:nomeSistem},true);
        if (filtro.length > 0) {
          var sistema = filtro[0];
          //setar as configurações do sistema encontrado
          config.versao        = sistema.versao;
          config.appTitle      = sistema.appTitle;
          config.appSubtitle   = sistema.appSubtitle;
          config.corLayoute    = sistema.corLayoute;
          config.modPerm       = sistema.modPerm;
          config.urlWebService = sistema.ambiente[ambiente].api;
          config.urlImagem     = sistema.ambiente[ambiente].img;
          config.dbase         = sistema.ambiente[ambiente].db;
          config.report        = sistema.ambiente[ambiente].report;
          config.urlSistema    = sistema.ambiente[ambiente].urlSistema;
          //iniciar a rota do sistema
          rotaInicial();
        } else {
          logger.danger(nomeSistem+' não foi encontrado no arquivo sistemas.json.');
        }

      });
    }
  }
})();

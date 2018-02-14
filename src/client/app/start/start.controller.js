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
    var reconect = 0;
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
      //Pegando as configurações no config do frontend
      var ambiente = config.sistema.ambiente;
      var api = 'startSistema/'+config.index;
      

      $http({method: 'POST',url: config.urlWebService+api}).then(function (result) {
        if (!result.data.status) {//se ouver status em data é para retornar o erro
          var sistema = result.data;
          //setar as configurações do sistema encontrado no backend
          config.versao        = sistema.versao;
          config.appTitle      = sistema.appTitle;
          config.appSubtitle   = sistema.appSubtitle;
          config.corLayoute    = sistema.corLayoute;
          config.modPerm       = sistema.modPerm;
          config.urlImagem     = sistema.ambiente[ambiente].img;
          config.dbase         = sistema.ambiente[ambiente].db;
          config.report        = sistema.ambiente[ambiente].report;
          config.urlSistema    = sistema.ambiente[ambiente].urlSistema;
          //iniciar a rota do sistema
          rotaInicial();
        } else {
          if (reconect<=3) {
            reconect++;
            getSistema();
          } else {
            logger.error(reconect+' Tentativas de conexão, erro: '+result.data.msg);
          }
          
        }
      });
    }
  }
})();

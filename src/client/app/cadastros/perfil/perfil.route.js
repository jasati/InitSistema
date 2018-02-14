(function() {
    'use strict';

    angular
        .module('cad.perfil')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
              state: 'layout.ctrlAcesso.perfils',
              config: {
                  url:'/perfil',
                  component:'perfil',
                  title:'Perfils',
                  resolve : {
                      funcoes: resolvePerfil
                  }
              }
            },
            {
              state: 'layout.ctrlAcesso.perfils.permissoes',
              config: {
                  url:'/permissoes',
                  //component:'permissoes',
                  title:'Permissões do Perfil',
                   views:{
                      '^.^.^.$default':{
                        component:'permissoes',
                      }
                   },
              }
            }
        ];
    }
    resolvePerfil.$inject = ['PerfilFuncService'];

    function resolvePerfil(PerfilFuncService) {
      var funcoes = new PerfilFuncService.funcoes();
      funcoes.startFiltro();
      return funcoes;
    }
})();

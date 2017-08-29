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
                  resolve : {
                      funcoes: resolvePerfil
                  }
              }
            },
            {
              state: 'layout.ctrlAcesso.perfils.permissoes',
              config: {
                  url:'/permissoes',
                  component:'permissoes',
                  // resolve : {
                  //     funcoes: function (funcoes) {
                  //         return funcoes
                  //     }
                  // }
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

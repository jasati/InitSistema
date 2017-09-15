(function() {
    'use strict';

    angular
        .module('app.psclse')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'psclse',
                config: {
                    url: '/identificação',
                    component:'site',
                    resolve : {
                        funcoes: resolveSite
                    }
                }
            },
            {
              state: 'psclse.swishi',
              config: {
                  url:'/swishi-de-cores',
                  component:'sessaoWizard',
              }
            }
        ];
    }
    resolveSite.$inject = ['CoresFuncService','$state'];

    function resolveSite(CoresFuncService,$state) {
      var funcoes = new CoresFuncService.funcoes();
      funcoes.codigo_acesso = '';
      funcoes.buscarCodigo = function () {
        if (funcoes.codigo_acesso !=='') {
            var qry = ' and codigo_acesso = '+funcoes.codigo_acesso;
            funcoes.sessao.read(qry,true).then(function (result) {
              if (result.qtde > 0) {
                funcoes.sessao.alterar(result.reg[0]);
                $state.go('psclse.swishi');
              } else {
                funcoes.codigoInvalido = true;
              }
            });
        }
      }
      //configurar filtros
      return funcoes;
    }
})();

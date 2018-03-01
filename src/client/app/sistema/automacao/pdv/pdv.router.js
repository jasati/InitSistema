(function() {
    'use strict';

    angular
        .module('app.automacao')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [

            {
                state: 'estacoes',
                config: {
                    url: '/estacoes',
                    component:'estacoesPdv',
                    title:'Estações de venda',
                    settings: {
                        nav    : 5,
                        icon   : 'shopping_cart',
                        content: 'Estações de Venda',
                        perm   : 8
                    },
                    resolve : {
                        funcoes: resolveEstacoes
                    }
                }
            },

        ];
    }

    resolveEstacoes.$inject = ['PdvFuncService'];

    function resolveEstacoes(PdvFuncService) {
      var funcoes = new PdvFuncService.funcoes();
      funcoes.pdv.data.filtroExterno = ' and e.status = 1';
      funcoes.pdv.activate();
      return funcoes;
    }

})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('movs', movs());

        function movs() {
          var component = {
            templateUrl: 'app/sistema/automacao/movestoque/templates/movs-main.html',
            bindings: {
                movs: '<',
            }
          }
          return component;
        }
})();


(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('movimentacoes', movimentacoes());

        function movimentacoes() {
          var component = {
            templateUrl: 'app/sistema/automacao/movestoque/templates/movimentacoes.html',
            bindings: {
                movs: '<',
            }
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('movimento', movimento());

        function movimento() {
          var component = {
            templateUrl: 'app/sistema/automacao/movestoque/templates/mov-cadastro.html',
            bindings: {
                movimento: '<',
            }
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('itensSaida', itensSaida());

        function itensSaida() {
          var component = {
            templateUrl: 'app/sistema/automacao/movestoque/templates/mov-itens-saida.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('itensEntrada', itensEntrada());

        function itensEntrada() {
          var component = {
            templateUrl: 'app/sistema/automacao/movestoque/templates/mov-itens-entrada.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('movItens', movItens());

        function movItens() {
          var component = {
            templateUrl: 'app/sistema/automacao/movestoque/templates/movimento-itens.html',
            bindings: {
                funcoes: '<',
                tipomov: '<'
            }
          }
          return component;
        }
})();
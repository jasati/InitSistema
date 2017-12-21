(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('viewTipoMov', viewTipoMov());

        function viewTipoMov() {
          var component = {
            bindings: {
                tipoMov: '<',
            },
            template:'<div class="visao" flex><tipomov tipo-mov="$ctrl.tipoMov"></tipomov><div ui-view></div></div>',
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('tipomov', tipomov());

        function tipomov() {
          var component = {
            templateUrl: 'app/sistema/automacao/movestoque/templates/tipos-mov.html',
            bindings: {
                tipoMov: '<',
            },
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('movs', movs());

        function movs() {
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
            templateUrl: 'app/sistema/automacao/movestoque/templates/movimento.html',
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
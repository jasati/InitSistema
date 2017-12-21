(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('pgitem', pgitem());

        function pgitem() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/templates/pgitem.html',
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
        .component('itemCadastros', itemCadastros());

        function itemCadastros() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/templates/cadastros.html',
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
        .component('itemEstoque', itemEstoque());

        function itemEstoque() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/templates/estoque.html',
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
        .component('itemTabela', itemTabela());

        function itemTabela() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/templates/tabela.html',
            bindings: {
                funcoes: '<',
            },
            //template:'<h1>Tabela de preço</h1> {{$ctrl.funcoes.table}}',
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('itemSelect', itemSelect());

        function itemSelect() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/templates/item-select.html',
            bindings: {
                funcoes: '<',
            },
          }
          return component;
        }
})();

(function() {
    'use strict';
    angular
        .module('app.automacao')
        .component('item', item());

        function item() {
          var component = {
            templateUrl: 'app/sistema/automacao/item/templates/item-cad.html',
            bindings: {
                funcoes: '<',
            },
          }
          return component;
        }
})();
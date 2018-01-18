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
            templateUrl: 'app/sistema/automacao/tipomov/templates/tipos-mov.html',
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
        .component('tipomovListagem', tipomovListagem());

        function tipomovListagem() {
          var component = {
            templateUrl: 'app/sistema/automacao/tipomov/templates/tipos-mov-listagem.html',
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
        .component('tipomovCad', tipomovCad());

        function tipomovCad() {
          var component = {
            templateUrl: 'app/sistema/automacao/tipomov/templates/tipos-mov-cad.html',
            bindings: {
                tipoMov: '<',
            },
          }
          return component;
        }
})();
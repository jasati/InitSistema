(function() {
    'use strict';
    angular
        .module('app.psclse')
        .component('cores', cores());

        function cores() {
          var component = {
            templateUrl: 'app/sistema/psicanalise/cores/templates/sessoes.html',
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
        .module('app.psclse')
        .component('sessaoWizard', sessaoWizard());

        function sessaoWizard() {
          var component = {
            templateUrl: 'app/sistema/psicanalise/cores/templates/sessao-wizard.html',
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
        .module('app.psclse')
        .component('swishi', swishi());

        function swishi() {
          var component = {
            templateUrl: 'app/sistema/psicanalise/cores/templates/cores-show.html',
            bindings: {
                funcoes: '<',
            }
          }
          return component;
        }
})();

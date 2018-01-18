(function() {
    'use strict';
    angular
        .module('cad.empresa')
        .component('empresaConfig', empresaConfig());

        function empresaConfig() {
          var component = {
            templateUrl: 'app/cadastros/empresa/templates/empresa-config.html',
            bindings: {
              empresa: '<',
            }
          }
          return component;
        }
})();
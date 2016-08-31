(function() {
    'use strict';
    angular
        .module('cad.usuario')
        .factory('UsuarioModalService', UsuarioModalService);
    UsuarioModalService.$inject = ['$modal'];
    /* @ngInject */
    function UsuarioModalService($modal) {
        var service = {
            editPerfil : editPerfil
        };
        return service;
        ////////////////

        function editPerfil(resolvers) {
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/usuario/templates/usuario-perfil.html',
              controller: 'UsuarioModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Dados: function () {
                  return resolvers;
                }
              }              
            });
            return modalInstance.result.then(function (save) {
              return save;
            });
        }        
    }
})();
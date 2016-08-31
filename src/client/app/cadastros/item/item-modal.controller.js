(function(){
    'use strict';

    angular
        .module('cad.item')
        .controller('ItemModalController', ItemModalController);
    ItemModalController.$inject = ['Item', '$modalInstance', '$scope', '$modal', 'ItemService'];
    /* @ngInject */
    function ItemModalController(Item, $modalInstance, $scope, $modal, ItemService) {
        var vm = this;
        vm.title = 'Cadastro Item';
        vm.item = Item.item;
        vm.categorias = Item.categorias;
        vm.subcategorias = Item.subcategorias;
        vm.unidades = Item.unidades;

        vm.ok = ok;
        vm.cancel = cancel;

        function ok(data) {
            $modalInstance.close(data);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .component('jTable', jTable());

    /* @ngInject */
    function jTable() {
        var component = {
            templateUrl: 'app/blocks/utils/templates/table/table.html',
            bindings:{
              funcoes:'=',
            },
            controller:tableControll,
        };

        return component;
    }
    tableControll.$inject = ['UtilsFunctions'];
    function tableControll(UtilsFunctions) {
        var vm = this;
        vm.isset = UtilsFunctions.isset;
    }

})();
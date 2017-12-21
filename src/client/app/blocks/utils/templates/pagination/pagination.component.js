(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .component('jPagination', jPagination());

    /* @ngInject */
    function jPagination() {
        var component = {
            templateUrl: 'app/blocks/utils/templates/pagination/pagination.html',
            bindings:{
              funcoes:'=',
            }
        };

        return component;
    }

})();
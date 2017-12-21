(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .component('jToolbar', jToolbar());

    /* @ngInject */
    function jToolbar() {
        var component = {
            templateUrl: 'app/blocks/utils/templates/toolbar/toolbar.html',
            bindings:{
              funcoes:'=',
            }
        };

        return component;
    }

})();
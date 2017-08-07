(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .component('aplyUpdates', aplyUpdates());

    /* @ngInject */
    function aplyUpdates() {
        var component = {
            templateUrl: 'app/blocks/utils/aplyUpdates/templates/aplyUpdates.html',
            controller: aplyUpdatesController,
            bindings:{
              funcoes:'=',
              divider:'<',
            }
        };

        return component;
    }

    aplyUpdatesController.$inject = ['$filter'];

    /* @ngInject */
    function aplyUpdatesController($filter) {

      var vm = this;
      vm.showAplyUpdates = function (array) {
        if (array) {
          var data = $filter('filter')(array,{action:'c'});
          if (data.length>0) {
            return true;
          } else {
            var data = $filter('filter')(array,{action:'u'});
            if (data.length>0) {
              return true;
            } else {
              var data = $filter('filter')(array,{action:'d'});
              if (data.length>0) {
                return true;
              } else {
                return false
              }
            }
          }
        } else {
          return false;
        }
      }
    }
})();

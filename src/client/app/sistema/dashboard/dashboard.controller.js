(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFuncService','$state'];
    /* @ngInject */
    function DashboardController(DashboardFuncService,$state) {
      var vm = this;
      vm.title = $state.current.settings.content;
      vm.icon = $state.current.settings.icon;
      vm.heigth = (screen.height-220)+'px';

      vm.funcoes = new DashboardFuncService.funcoes();
  

    }
})();

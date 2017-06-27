(function() {
    'use strict';
    angular
        .module('app.layout')
        .service('LayoutService', LayoutService);
    LayoutService.$inject = ['$mdSidenav','routerHelper','$mdPanel','Provider','$state'];
    /* @ngInject */
    function LayoutService($mdSidenav,routerHelper,$mdPanel,Provider,$state) {
        this.funcoes = funcoes;
        ////////////////
        function funcoes() {
	        var vm = this;
	        var states = routerHelper.getStates();
	        vm.usuario = Provider.getSessaoUsuario();
	        vm.title = "Sistema";

	        vm.openSideNave = function () {
	            $mdSidenav('left').toggle();
	        }
	        vm.closeSideNave = function () {
	        	$mdSidenav('left').close();
	        }

            vm.setTitle = function (title) {
                vm.title = title;
            }

	        vm.getNavRoutes = function () {
	            vm.navRoutes = states.filter(function(r) {
	                return r.settings && r.settings.nav;
	            }).sort(function(r1, r2) {
	                return r1.settings.nav - r2.settings.nav;
	            });
	        }

	        vm.showUser = function () {
	            var panel = $mdPanel;
	            var position = panel.newPanelPosition()
	                .relativeTo('.avatar-user')
	                .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);
	            panel.open({
	                attachTo: angular.element(document.body),
	                controller: controllModal,
	                controllerAs: 'vm',
	                disableParentScroll:true,
	                templateUrl: 'app/layout/templates/usermenu.html',
	                hasBackdrop: false,
	                position: position,
	                trapFocus: true,
	                zIndex: 2,
	                clickOutsideToClose: true,
	                escapeToClose: true,
	                focusOnOpen: true,
	                locals: {
	                  Data: vm.usuario
	                }
	            });
	            controllModal.$inject = ['Data','mdPanelRef','UsuarioFuncService'];
	            function controllModal(Data,mdPanelRef,UsuarioFuncService) {
	                var vm = this;
	                vm.usuario = Data;
	                vm.logoff = logoff;
	                vm.funcoes = new UsuarioFuncService.funcoes();

	                function logoff() {
	                    vm.funcoes.endSession();
	                    mdPanelRef.close();
	                }
	            }
	        }
        }
    }
})();
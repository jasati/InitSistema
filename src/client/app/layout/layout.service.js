(function() {
    'use strict';
    angular
        .module('app.layout')
        .service('LayoutService', LayoutService);
    LayoutService.$inject = ['$mdSidenav','routerHelper','$mdPanel','Provider','$state','config','UtilsFunctions','$filter','$mdMedia','FiltroService'];
    /* @ngInject */
    function LayoutService($mdSidenav,routerHelper,$mdPanel,Provider,$state,config,UtilsFunctions,$filter,$mdMedia,FiltroService) {
        this.funcoes = funcoes;
        ////////////////
        function funcoes() {
	        var vm = this;
	        vm.isset = UtilsFunctions.isset;
	        var states = routerHelper.getStates();
          	vm.pathImg = config.urlImagem;
	        vm.usuario = Provider.getSessaoUsuario();
         	vm.verPermissao = UtilsFunctions.getPermissao;
          	vm.altImg =config.appTitle; 
	        vm.title = config.appTitle;
	        vm.vLayoute = config.vLayoute;
	        vm.config = config;
	        vm.paths = null;
	        //variavel para ter a
	        var filtroData = new FiltroService.funcData();
	        Provider.setFiltroData(filtroData);

	        vm.openSideNave = function (id) {
	        	switch(id){
	        		case 'left':
    					$mdSidenav('left').toggle();
    					break;
					case 'right':
						$mdSidenav('right').toggle();
						break;
					default:
						$mdSidenav('left').toggle();
	        	}
	            
	        }
	        vm.closeSideNave = function (id) {
	        	$mdSidenav('left').close();
	        }

            vm.setTitle = function (title) {
                vm.title = title;
            }
          	vm.mediaxs = function() {
            	return $mdMedia('xs');
         	}
            vm.setPath = function (data) {
            	var paths=[];
            	for (var i = 0; i < data.length; i++) {
            		if (data[i].views != undefined && data[i].state.name != 'layout') {
            			paths.push(data[i]);
            		} 
            	}
            	vm.paths = paths;
            	vm.subtitle = config.docTitle;
            	vm.backSubtitle = function () {
            		$state.go(paths[paths.length - 2].state.name);
            	};
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
	                .relativeTo('#user-name')
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

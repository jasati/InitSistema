(function() {
    'use strict';
    angular
        .module('app.layout')
        .component('layoute', {
        	bindings: { vm: '<' },
            templateUrl: 'app/layout/templates/layout.html',
            controller: LayoutController,
            // controllerAs: 'vm',
        });
	    LayoutController.$inject = ['LayoutService'];
	    /* @ngInject */
	    function LayoutController(LayoutService) {
	        //var vm = this;
	        this.hidelogomarca = true;
	        this.funcoes = new LayoutService.funcoes();
	        this.funcoes.getNavRoutes();

	    }
})();

(function() {
    'use strict';
    angular
        .module('app.layout')
        .component('mainHeader', {
            templateUrl: 'app/layout/templates/header.html',
            bindings: {
            	funcoes:'<',
            },
        });

})();

(function() {
    'use strict';
    angular
        .module('app.layout')
        .component('mainNav', {
            templateUrl: 'app/layout/templates/nav.html',
            bindings: {
                funcoes:'<',
            },
        });

})();

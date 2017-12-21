(function() {
    'use strict';
    angular
        .module('app.layout')
        .component('layoute', {
        	bindings: { layoute: '<' },
            templateUrl: 'app/layout/templates/layout.html',
            controller: LayoutController,
            // controllerAs: 'vm',
        });

	    function LayoutController() {
	        //var vm = this;
	        this.hidelogomarca = true;
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

(function() {
    'use strict';
    angular
        .module('app.layout')
        .component('footer', {
            templateUrl: 'app/layout/templates/footer.html',
            bindings: {
                funcoes:'<',
            },
        });

})();

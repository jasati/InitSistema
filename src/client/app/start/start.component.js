(function() {
    'use strict';
    angular
        .module('app.start')
        .component('start', {
            template:'<div layout="row" layout-align="center center"><div><p>Inicializando...</p></div></div>',
            controller: 'StartController',
        });
})();

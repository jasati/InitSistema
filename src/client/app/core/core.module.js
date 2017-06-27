(function () {
    'use strict';

    angular
        .module('app.core', [
        	'ngCookies',
            'ngAnimate', 
            'ngSanitize',
            'ngMessages',
            'blocks.exception', 'blocks.logger', 'blocks.router', 'blocks.utils',
            'ui.router', 'ngplus', 'ui.bootstrap', 'angularFileUpload','ngMaterial','nvd3',
            'md.data.table','data-table'
        ]);
})();
/*
md.data.table
manual
https://github.com/daniel-nagy/md-data-table

data-table
manual
https://github.com/Swimlane/angular-data-table
 */
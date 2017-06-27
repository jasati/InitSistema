/*
        	var campos = '';
        	
	    	var inner_join = {
	            0:"",
	        };

	    	var left_join = {
	            0:"",
	        };

	        var camposInvalidos = [''];

        	var dataset = {
        		campos          : campos,
        		inner_join      : inner_join,
        		left_join       : left_join,
        		camposInvalidos : camposInvalidos,
        		id_index_main   : 'id_empresa',
        		valor_id_main   : empresa.id_empresa,
        		moduloQuery     : '',//modulo com alias para consultas
        		modulo          : '',
        		id_tabela       : '',
        		orderBy         : '',
        		groupBy         : '',
        	};
        	return dataset;

 */

(function() {
    'use strict';
    angular
        .module('app.core')
        .factory('Dataset', Dataset);
    Dataset.$inject = ['Provider','ApiService'];
    /* @ngInject */
    function Dataset(Provider,ApiService) {

        var empresa = Provider.getSessaoEmpresa();
        var api = {
            create  : ApiService.create,
            read    : ApiService.read,
            update  : ApiService.update,
            deletar : ApiService.deletar,
        };
        var service = {
        	usuario        : usuario,
        };
        return service;
        ////////////////
        
        function usuario() {
        	var campos = '';

	    	var inner_join = {
	            0:"",
	        };

	    	var left_join = {
	            0:"",
	        };

	        var camposInvalidos = [];

        	var dataset = {
                api             : api,
        		empresa         : empresa,
        		campos          : campos,
        		inner_join      : inner_join,
        		left_join       : left_join,
        		camposInvalidos : camposInvalidos,
        		id_index_main   : '1',
        		valor_id_main   : '1',
        		moduloQuery     : 'usuarios u',//modulo com alias para consultas
        		modulo          : 'usuarios',
        		id_tabelaQuery  : 'u.id_usuario',
        		id_tabela       : 'id_usuario',
        		orderBy         : '',
        		groupBy         : '',
                provider        : Provider,
        	};
        	return dataset;
        }


    }
})();
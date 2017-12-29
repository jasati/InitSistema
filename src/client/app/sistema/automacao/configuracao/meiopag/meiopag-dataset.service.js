(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('MeioPagDataSet', MeioPagDataSet);
    MeioPagDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function MeioPagDataSet(AutomacaoProvider) {
        this.meiopag = meiopag;

        ////////////////
        function meiopag() {
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset
	        var tableCols = [
	          {prop:'descricao',name:'Descrição',show:true},
	        ];
	        var inner_join = {
	             0:"",
	        };
	        var left_join = {
	            0:"",
	        };
        	dataSet.campos           = '';
        	dataSet.inner_join       = inner_join;
        	dataSet.left_join        = left_join;
        	dataSet.modulo           = 'meios_pag';
        	dataSet.moduloQuery      = 'meios_pag';
        	dataSet.id_tabela        = 'id_meio_pag';
        	dataSet.id_tabelaQuery   = 'id_meio_pag';
        	dataSet.tableCols        = tableCols;
        	dataSet.camposData       = [];
            dataSet.camposInvalidos  = ['action'];
        	return  dataSet;
        }

    }
})();
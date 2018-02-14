(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('EstacaoDataSet', EstacaoDataSet);
    EstacaoDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function EstacaoDataSet(AutomacaoProvider) {
        this.estacao   = estacao;
        ////////////////
        function estacao() {
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset

            var campos = 'e.id_estacao, e.id_filial, e.descricao, e.status, CASE WHEN e.status = 1 THEN "ATIVO" ELSE "INATIVO" END AS desc_status, '+
            '(select CASE WHEN c.status = "A" THEN "O" ELSE "L" END from caixa c where c.id_estacao = e.id_estacao order by c.id_caixa desc limit 1) as situacao_caixa,'+
            '(select c.id_usuario from caixa c where c.id_estacao = e.id_estacao order by c.id_caixa desc limit 1) as id_usuario_caixa';

	        var tableCols = [
	          {prop:'descricao',name:'Descrição',show:true},
              {prop:'desc_status',name:'Status',show:true}
	        ];
            var camposFiltro = [
                {field:"e.status",alias:"Status",type:"fixed",values:[{value:1,alias:"Ativo"},{value:0,alias:"Inativo"}]},
            ];

	        var inner_join = {
	            0:"filial f ON e.id_filial = f.id_filial",
	        };
            var camposInvalidos = ['action','desc_status','situacao_caixa','id_usuario_caixa'];

            dataSet.campos         = campos;
        	dataSet.inner_join     = inner_join;
        	dataSet.modulo         = 'estacao';
        	dataSet.moduloQuery    = 'estacao e';
        	dataSet.id_tabela      = 'id_estacao';
        	dataSet.id_tabelaQuery = 'e.id_estacao';
            dataSet.orderBy        = 'e.descricao'; 
        	dataSet.tableCols      = tableCols;
            dataSet.camposInvalidos= camposInvalidos;
            dataSet.camposFiltro   = camposFiltro;
            dataSet.id_index_main  = 'f.id_empresa';
        	return  dataSet;
        }
    }
})();
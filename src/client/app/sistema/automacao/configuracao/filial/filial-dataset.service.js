(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('FilialDataSet', FilialDataSet);
    FilialDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function FilialDataSet(AutomacaoProvider) {
        this.filial  = filial;
        ////////////////
        function filial() {
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset
            /*


             */
            //campos sem tabela de preço
            var campos = 'f.id_filial, f.id_empresa, f.id_pessoa, f.status, p.data_cad, p.nome_comp, p.nome_red, p.data_nasc, p.tipo, p.cpf_cnpj, p.rg, p.uf, p.cidade, p.bairro, p.logradouro, p.numero, p.complemento, p.cep, p.email, p.tel, p.cel1, p.cel2, p.email_acess, p.senha,CASE WHEN f.status=1 THEN "ATIVO" ELSE "INATIVO" END AS desc_status';

	        var tableCols = [
	          {prop:'nome_red',name:'Fantasia',show:true},
	          {prop:'nome_comp',name:'Razão',show:true},
              {prop:'desc_status',name:'Status',show:true}
	        ];
            var camposFiltro = [
                {field:"f.status",alias:"Status",type:"fixed",values:[{value:1,alias:"Ativo"},{value:0,alias:"Inativo"}]},
            ];

	        var inner_join = {
	            0:"pessoas p ON f.id_pessoa = p.id_pessoa",
	        };
            var camposInvalidos = ['action', 'data_cad', 'nome_comp', 'nome_red', 'data_nasc', 'tipo', 'cpf_cnpj', 'rg', 'uf', 'cidade', 'bairro', 'logradouro', 'numero', 'complemento', 'cep', 'email', 'tel','cel1', 'cel2', 'email_acess', 'senha','obs','desc_status'];

            dataSet.campos         = campos;
        	dataSet.inner_join     = inner_join;
        	dataSet.modulo         = 'filial';
        	dataSet.moduloQuery    = 'filial f';
        	dataSet.id_tabela      = 'id_filial';
        	dataSet.id_tabelaQuery = 'f.id_filial';
            dataSet.orderBy        = 'p.nome_comp'; 
        	dataSet.tableCols      = tableCols;
        	dataSet.camposData     = ['data_cad'];
            dataSet.camposInvalidos= camposInvalidos;
            dataSet.camposFiltro   = camposFiltro;
            dataSet.id_index_main  = 'f.id_empresa';
        	return  dataSet;
        }

    }
})();
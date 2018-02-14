(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('VendedorDataSet', VendedorDataSet);
    VendedorDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function VendedorDataSet(AutomacaoProvider) {
        this.vendedor  = vendedor;
        ////////////////
        function vendedor() {
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset
            /*


             */
            //campos sem tabela de preço
            var campos = 'v.id_vendedor, v.id_pessoa, v.status, p.id_empresa, p.data_cad, p.nome_comp, p.nome_red, p.data_nasc, p.tipo, p.cpf_cnpj, p.rg, p.uf, p.cidade, p.bairro, p.logradouro, p.numero, p.complemento, p.cep, p.email, p.tel, p.cel1, p.cel2, p.email_acess, p.senha,CASE WHEN v.status=1 THEN "ATIVO" ELSE "INATIVO" END AS desc_status';

	        var tableCols = [
	          {prop:'nome_red',name:'Apelido',show:true},
	          {prop:'nome_comp',name:'Nome Completo',show:true},
              {prop:'desc_status',name:'Status',show:true}
	        ];
            var camposFiltro = [
                {field:"v.status",alias:"Status",type:"fixed",values:[{value:1,alias:"Ativo"},{value:0,alias:"Inativo"}]},
            ];

	        var inner_join = {
	            0:"pessoas p ON v.id_pessoa = p.id_pessoa",
	        };
            var camposInvalidos = ['action','id_empresa', 'data_cad', 'nome_comp', 'nome_red', 'data_nasc', 'tipo', 'cpf_cnpj', 'rg', 'uf', 'cidade', 'bairro', 'logradouro', 'numero', 'complemento', 'cep', 'email', 'tel','cel1', 'cel2', 'email_acess', 'senha','obs','desc_status'];

            dataSet.campos         = campos;
        	dataSet.inner_join     = inner_join;
        	dataSet.modulo         = 'vendedor';
        	dataSet.moduloQuery    = 'vendedor v';
        	dataSet.id_tabela      = 'id_vendedor';
        	dataSet.id_tabelaQuery = 'v.id_vendedor';
            dataSet.orderBy        = 'p.nome_comp'; 
        	dataSet.tableCols      = tableCols;
        	dataSet.camposData     = ['data_cad'];
            dataSet.camposInvalidos= camposInvalidos;
            dataSet.camposFiltro   = camposFiltro;
            dataSet.id_index_main  = 'p.id_empresa';
        	return  dataSet;
        }

    }
})();
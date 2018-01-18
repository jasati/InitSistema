(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('TipoMovDataSet', TipoMovDataSet);
    TipoMovDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function TipoMovDataSet(AutomacaoProvider) {
        this.tipomov = tipomov;
        ////////////////
        function tipomov() {
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset
           
          var campos = 'id_tipo_mov, id_empresa, descricao, tipo, status, alt_cad_item, mov_estoque, CASE WHEN tipo = "S" THEN "Saida do estoque" WHEN tipo = "E" THEN "Entrada no estoque" WHEN tipo = "P" THEN "Não movimenta estoque" END AS desc_tipo';

          var camposFiltro = [
              {field:"tipo",alias:"Tipo",type:"string"}
          ];

          // filtroDefault é a pesquisa que ja vem padrao pelo sistema
          var filtroDefault = [
            {campo:"status",express:"=",value:"1",alias:"Status",aliasValue:"Ativo",type:"fixed"},
          ];

	        var tableCols = [
	          {prop:'descricao',name:'Tipo de movimentação',show:true},
	        ];
	        var inner_join = {
	             0:"",
	        };
	        var left_join = {
	            0:"",
	        };

        	dataSet.campos         = campos;
          dataSet.camposFiltro   = camposFiltro,
          dataSet.filtroDefault  = filtroDefault,
        	dataSet.inner_join     = inner_join;
        	dataSet.left_join      = left_join;
        	dataSet.modulo         = 'tipo_mov_estoque';
        	dataSet.moduloQuery    = 'tipo_mov_estoque';
        	dataSet.id_tabela      = 'id_tipo_mov';
        	dataSet.id_tabelaQuery = 'id_tipo_mov';
        	dataSet.tableCols      = tableCols;
          dataSet.camposInvalidos= ['action','desc_tipo'];
          dataSet.camposForeignKey = ['id_empresa'];//campos chave estrangeira
        	return  dataSet;

        }

    }
})();
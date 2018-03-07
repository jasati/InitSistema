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
           
          var campos = 'tme.id_tipo_mov, tme.id_empresa, tme.descricao, tme.tipo, tme.status, tme.alt_cad_item, tme.mov_estoque, CASE WHEN tme.tipo = "S" THEN "Saida do estoque" WHEN tme.tipo = "E" THEN "Entrada no estoque" WHEN tme.tipo = "P" THEN "Não movimenta estoque" END AS desc_tipo, (SELECT COUNT(em.id_mov) FROM estoque_mov em WHERE em.id_tipo_mov = tme.id_tipo_mov and em.status="F") as qt_mov';

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
        	dataSet.moduloQuery    = 'tipo_mov_estoque tme';
        	dataSet.id_tabela      = 'id_tipo_mov';
        	dataSet.id_tabelaQuery = 'tme.id_tipo_mov';
        	dataSet.tableCols      = tableCols;
          dataSet.camposInvalidos= ['action','desc_tipo','qt_mov'];
          dataSet.camposForeignKey = ['id_empresa'];//campos chave estrangeira
        	return  dataSet;

        }

    }
})();
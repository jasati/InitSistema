(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('InventarioDataSet', InventarioDataSet);
    InventarioDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function InventarioDataSet(AutomacaoProvider) {
        this.dataSetMaster  = dataSetMaster;
        this.dataSetDetalhe = dataSetDetalhe;
        ////////////////
        function dataSetMaster() {
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset
	        var tableCols = [
	          {prop:'data_cad',name:'Data',show:true},
	          {prop:'categoria',name:'Categoria dos Itens',show:true},
              {prop:'desc_status',name:'Status',show:true}
	        ];
	        var inner_join = {
	             0:"categorias c ON ei.id_categoria = c.id_categoria",
	        };
	        var left_join = {
	            0:"estoque_mov em ON ei.id_mov = em.id_mov",
	        };
        	dataSet.campos         = 'ei.id_inventario, ei.id_filial, ei.id_categoria, ei.id_mov, ei.data_cad, ei.status, c.descricao as categoria, em.n_nf,  CASE WHEN ei.status = 0 THEN "CONTAGEM EM ANDAMENTO" ELSE "CONTAGEM CONCLUIDA" END AS desc_status';
        	dataSet.inner_join     = inner_join;
        	dataSet.left_join      = left_join;
        	dataSet.modulo         = 'estoque_inventario';
        	dataSet.moduloQuery    = 'estoque_inventario ei';
        	dataSet.id_tabela      = 'id_inventario';
        	dataSet.id_tabelaQuery = 'ei.id_inventario';
        	dataSet.tableCols      = tableCols;
        	dataSet.camposData     = ['data_cad'];
            dataSet.camposInvalidos  = ['action','categoria','n_nf','desc_status'];
        	return  dataSet;

        }

        function dataSetDetalhe() {
            //instanciar o modelo de dataSet
            var dataSet = new AutomacaoProvider.provider();
            //realizar as configurações do dataset
            var tableCols = [
              {prop:'i.codigo',name:'Código',show:true},
              {prop:'i.marca',name:'Marca',show:true}
            ];
            var inner_join = {
                 0:"itens i ON ei.id_item = i.id_item",
            };
            var left_join = {
                0:"item_unidade iu ON i.id_unidade = iu.id_unidade",
            };
            dataSet.campos           = 'ei.id_inventario_item, ei.id_inventario, ei.id_item, ei.qt, i.codigo, i.descricao, i.marca, i.ref, iu.sigla, i.saldo';
            dataSet.inner_join       = inner_join;
            dataSet.left_join        = left_join;
            dataSet.modulo           = 'estoque_inventario_itens';
            dataSet.moduloQuery      = 'estoque_inventario_itens ei';
            dataSet.id_tabela        = 'id_inventario_item';
            dataSet.id_tabelaQuery   = 'ei.id_inventario_item';
            dataSet.tableCols        = tableCols;
            dataSet.camposData       = [];
            dataSet.camposForeignKey = ['id_inventario'];
            dataSet.valueForeignKey  = [];
            dataSet.camposInvalidos  = ['action','codigo','descricao','marca','ref','sigla','categoria','custo','data_cad','detalhes','fornecedor','id_categoria','id_empresa','id_galeria','id_unidade','imagem','perc_preco','perc_tabela','preco','saldo','saldo_max','saldo_min','status','valor'];
            dataSet.id_index_main    = 'i.id_empresa';
            return  dataSet;
        }
    }
})();
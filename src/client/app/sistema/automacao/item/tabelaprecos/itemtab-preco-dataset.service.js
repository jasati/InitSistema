(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('ItemTabPrecoDataSet', ItemTabPrecoDataSet);
    ItemTabPrecoDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function ItemTabPrecoDataSet(AutomacaoProvider) {
        this.dataSetMaster  = dataSetMaster;
        ////////////////
        function dataSetMaster() {
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset

	        var inner_join = {
	             0:"tabela_prazos tp ON itp.id_tp = tp.id_tp",
                 1:"tabela t ON tp.id_tabela = t.id_tabela",
	        };

        	dataSet.campos         = 'itp.id_tabela_preco, itp.id_item, itp.id_tp, itp.valor, itp.perc_lucro, tp.descricao as desc_tab_prazo, tp.percentual as perc_opcao, t.descricao as desc_tab, t.tipo, CONCAT(t.descricao," ",tp.descricao) as desc_tab_comp';
        	dataSet.inner_join     = inner_join;
        	dataSet.modulo         = 'itens_tabela_preco';
        	dataSet.moduloQuery    = 'itens_tabela_preco itp';
        	dataSet.id_tabela      = 'id_tabela_preco';
        	dataSet.id_tabelaQuery = 'itp.id_tabela_preco';
            dataSet.camposInvalidos  = ['action','desc_tab_prazo','perc_opcao','desc_tab','tipo','desc_tab_comp'];
        	return  dataSet;

        }

    }
})();
(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('TabelaDataSet', TabelaDataSet);
    TabelaDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function TabelaDataSet(AutomacaoProvider) {
        this.tabela              = tabela;
        this.tabelaPrazos        = tabelaPrazos;
        this.tabPrazosMeioPag    = tabPrazosMeioPag;
        this.createTabPrecoItens = createTabPrecoItens;
        ////////////////
        function tabela() {
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset
	        var tableCols = [
	          {prop:'descricao',name:'Classificações',show:true},
	        ];
	        var inner_join = {
	             0:"",
	        };
	        var left_join = {
	            0:"",
	        };
        	dataSet.campos         = '';
        	dataSet.inner_join     = inner_join;
        	dataSet.left_join      = left_join;
        	dataSet.modulo         = 'tabela';
        	dataSet.moduloQuery    = 'tabela';
        	dataSet.id_tabela      = 'id_tabela';
        	dataSet.id_tabelaQuery = 'id_tabela';
        	dataSet.tableCols      = tableCols;
        	dataSet.camposData     = [];
            dataSet.camposInvalidos  = ['action'];
            dataSet.camposForeignKey = ['id_empresa'];//campos chave estrangeira
        	return  dataSet;

        }

        function tabelaPrazos() {
            //instanciar o modelo de dataSet
            var dataSet = new AutomacaoProvider.provider();
            //realizar as configurações do dataset
            var tableCols = [
              {prop:'descricao',name:'Descrição da tabela',show:true},
              {prop:'percentual',name:'% Lucro Opcional',show:true}
            ];
            var inner_join = {
                 0:"tabela t ON tp.id_tabela = t.id_tabela",
            };
            var left_join = {
                0:"",
            };
            dataSet.campos           = 'tp.id_tp, tp.descricao, tp.id_tabela, tp.percentual, t.id_empresa, t.descricao as tabela, t.tipo';
            dataSet.inner_join       = inner_join;
            dataSet.left_join        = left_join;
            dataSet.modulo           = 'tabela_prazos';
            dataSet.moduloQuery      = 'tabela_prazos tp';
            dataSet.id_tabela        = 'id_tp';
            dataSet.id_tabelaQuery   = 'tp.id_tp';
            dataSet.tableCols        = tableCols;
            dataSet.camposData       = [];
            dataSet.camposForeignKey = ['id_tabela'];
            dataSet.valueForeignKey  = [];
            dataSet.camposInvalidos  = ['action','tabela','tipo','id_empresa'];
            dataSet.id_index_main    = 't.id_empresa';
            return  dataSet;
        }

        function tabPrazosMeioPag() {
            //instanciar o modelo de dataSet
            var dataSet = new AutomacaoProvider.provider();
            //realizar as configurações do dataset
            var tableCols = [
              {prop:'meio_pag',name:'Meio de Pagamento',show:true},
            ];
            var inner_join = {
                 0:"meios_pag mp ON tpmp.id_meio_pag = mp.id_meio_pag",
                 1:"tabela_prazos tp ON tpmp.id_tp = tp.id_tp",
                 2:"tabela t ON tp.id_tabela = t.id_tabela",
            };
            var left_join = {
                0:"",
            };
            dataSet.campos           = 'tpmp.id_tpmp, tpmp.id_tp, tpmp.id_meio_pag, mp.descricao as meio_pag, tp.descricao as tab_prazo, tp.percentual as lucro, t.descricao as tabela, t.tipo as tipo_tab';
            dataSet.inner_join       = inner_join;
            dataSet.left_join        = left_join;
            dataSet.modulo           = 'tabela_prazo_meio_pag';
            dataSet.moduloQuery      = 'tabela_prazo_meio_pag tpmp';
            dataSet.id_tabela        = 'id_tpmp';
            dataSet.id_tabelaQuery   = 'tpmp.id_tpmp';
            dataSet.tableCols        = tableCols;
            dataSet.camposData       = [];
            dataSet.camposForeignKey = ['id_tp'];
            dataSet.valueForeignKey  = [];
            dataSet.camposInvalidos  = ['action','meio_pag','tab_prazo','lucro','tabela','tipo_tab'];
            dataSet.id_index_main    = 't.id_empresa';
            return  dataSet;
        }

        // chama a função no banco de dados para criar a tabela de preços em cada item 
        // que ainda nao tem a tabela especifica da chamada
        function createTabPrecoItens() {
            //instanciar o modelo de dataSet
            var dataSet = new AutomacaoProvider.provider();
            //realizar as configurações do dataset
            dataSet.modulo           = 'create_tabela_preco_item';
            return  dataSet;
        }        
    }
})();
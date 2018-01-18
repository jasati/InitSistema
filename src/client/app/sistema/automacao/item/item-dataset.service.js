(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('ItemDataSet', ItemDataSet);
    ItemDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function ItemDataSet(AutomacaoProvider) {
        this.item  = item;
        ////////////////
        function item() {
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset
            /*
SELECT 
    i.id_empresa, 
    i.id_item, 
    i.id_galeria, 
    i.id_categoria, 
    i.codigo, 
    i.ref, 
    i.descricao,
    i.id_unidade,
    i.detalhes, 
    i.marca, 
    i.status, 
    i.saldo, 
    i.data_cad, 
    i.saldo_min, 
    i.saldo_max, 
    i.custo, 
    i.id_fornecedor,
    iu.sigla, 
    cf.descricao as categoria, 
    g.imagem, 
    p.nome_red as fornecedor, 
    p.nome_comp as razao_fornecedor,
    itp.valor,
    itp.perc_lucro,
    CONCAT(t.descricao,' ',tp.descricao) as desc_tabela,
    CASE WHEN i.status=1 THEN "ATIVO" ELSE "INATIVO" END AS desc_status
FROM itens i 
LEFT JOIN galeria g on i.id_galeria = g.id_galeria
LEFT JOIN item_unidade iu on i.id_unidade = iu.id_unidade
LEFT JOIN categorias cf on i.id_categoria = cf.id_categoria
LEFT JOIN categorias cp on cf.id_cat_pai = cp.id_categoria
LEFT JOIN categorias ca on cp.id_cat_pai = ca.id_categoria
LEFT JOIN fornecedor f ON i.id_fornecedor = f.id_fornecedor
LEFT JOIN pessoas p ON f.id_pessoa = p.id_pessoa
LEFT JOIN itens_tabela_preco itp ON i.id_item = itp.id_item
LEFT JOIN tabela_prazos tp ON itp.id_tp = tp.id_tp
LEFT JOIN tabela t ON tp.id_tabela = t.id_tabela
WHERE tp.id_tp = 7

             */
            //campos sem tabela de preço
            var campos    = 'DISTINCT i.id_empresa, i.id_item, i.id_galeria, i.id_categoria, i.codigo, i.ref, i.descricao,i.id_unidade,i.detalhes, i.marca, i.status, i.saldo, i.data_cad, i.saldo_min, i.saldo_max, i.custo, i.id_fornecedor,iu.sigla, cf.descricao as categoria, g.imagem, p.nome_red as fornecedor, p.nome_comp as razao_fornecedor';
            //campos com tabela de preço
            var camposTab = 'i.id_empresa, i.id_item, i.id_galeria, i.id_categoria, i.codigo, i.ref, i.descricao,i.id_unidade,i.detalhes, i.marca, i.status, i.saldo, i.data_cad, i.saldo_min, i.saldo_max, i.custo, i.id_fornecedor,iu.sigla, cf.descricao as categoria, g.imagem, p.nome_red as fornecedor, p.nome_comp as razao_fornecedor,itp.valor,itp.perc_lucro,CONCAT(t.descricao," ",tp.descricao) as desc_tabela,CASE WHEN i.status=1 THEN "ATIVO" ELSE "INATIVO" END AS desc_status';

	        var tableCols = [
	          {prop:'data_cad',name:'Data',show:true},
	          {prop:'categoria',name:'Categoria dos Itens',show:true},
              {prop:'desc_status',name:'Status',show:true}
	        ];
            var camposFiltro = [
                {field:"i.codigo",alias:"Código",type:"string"},
                {field:"i.ref",alias:"Referência",type:"string"},
                {field:"i.marca",alias:"Marca",type:"string"},
                {field:"p.nome_comp",alias:"Fornecedor",type:"string"},
                {field:"iu.sigla",alias:"Unidade de Medida",type:"string"},
                {field:"i.status",alias:"Status",type:"fixed",values:[{value:1,alias:"Ativo"},{value:0,alias:"Inativo"}]},
                {field:"cf.descricao",alias:"Categoría",type:"dinamic",values:'parent'}//funciona o autocomplete no filtro> values é o campo texto que sera apresentado no template do autocomplete
            ];

	        var inner_join = {
	            0:"",
	        };
	        var left_join = {
                0:"galeria g on i.id_galeria = g.id_galeria",
                1:"item_unidade iu on i.id_unidade = iu.id_unidade",
                2:"categorias cf on i.id_categoria = cf.id_categoria",
                3:"categorias cp on cf.id_cat_pai = cp.id_categoria",
                4:"categorias ca on cp.id_cat_pai = ca.id_categoria",
                5:"fornecedor f ON i.id_fornecedor = f.id_fornecedor",
                6:"pessoas p ON f.id_pessoa = p.id_pessoa",
                7:"itens_tabela_preco itp ON i.id_item = itp.id_item",
                8:"tabela_prazos tp ON itp.id_tp = tp.id_tp",
                9:"tabela t ON tp.id_tabela = t.id_tabela",
	        };
            var camposInvalidos = [
                'action','imagem','perc_tabela','valor','sigla','categoria','fornecedor',
                'id_mov_item','id_mov','qt','desconto','desc_perc','acres','razao_fornecedor',
                'valor','perc_lucro','desc_tabela','desc_status'
            ];
            dataSet.modCamposTab   = function (prm) {
               //liga ou desliga os campos que exibe a tabela de preço
               dataSet.campos         = prm?camposTab:campos;
            };
        	dataSet.inner_join     = inner_join;
        	dataSet.left_join      = left_join;
        	dataSet.modulo         = 'itens';
        	dataSet.moduloQuery    = 'itens i';
        	dataSet.id_tabela      = 'id_item';
        	dataSet.id_tabelaQuery = 'i.id_item';
            dataSet.orderBy        = 'i.descricao'; 
        	dataSet.tableCols      = tableCols;
        	dataSet.camposData     = ['data_cad'];
            dataSet.camposInvalidos= camposInvalidos;
            dataSet.camposFiltro   = camposFiltro;
            dataSet.id_index_main  = 'i.id_empresa';
            dataSet.campoImagem    = 'imagem';
            dataSet.camposForeignKey = ['id_empresa'];//campos chave estrangeira
        	return  dataSet;
        }

    }
})();
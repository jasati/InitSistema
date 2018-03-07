(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('MovDataSet', MovDataSet);
    MovDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function MovDataSet(AutomacaoProvider) {
        this.mov                 = mov;
        this.movitens            = movitens;
        ////////////////
        function mov() {
            /*
SELECT
em.id_mov,
em.id_filial,
em.id_pessoa_emitente,
em.id_pessoa_destinatario,
em.id_tipo_mov,
em.id_vendedor,
em.id_tp,
em.data_mov,
em.status,
em.numero,
em.data_emissao,
em.data_saida,
em.obs,  
CASE
WHEN em.status = 'A' THEN 'ABERTO'
WHEN em.status = 'C' THEN 'CANCELADO'
WHEN em.status = 'F' THEN 'FECHADO'
END AS desc_status,
tmp.descricao as desc_tipo_mov,
tmp.tipo as tipo_mov,
vf.nome_comp as filial_nome_comp,
vf.nome_red as filial_nome_red,
vf.logradouro as filial_logradouro,
vf.cpf_cnpj as filial_cpf_cnpj,
vf.numero as filial_numero,
vf.cidade as filial_cidade,
vf.uf as filial_uf,
vf.tel as filial_tel,
emp.id_empresa,
emp.slogan,
vv.nome_comp as vendedor_nome_comp,
vv.nome_red as vendedor_nome_red,
pe.nome_comp as p_emi_nome_comp,
pe.nome_red as p_emi_nome_red,
pe.cpf_cnpj as p_emi_cpf_cnpj,
pe.logradouro as p_emi_logradouro,
pe.numero as p_emi_numero,
pe.uf as p_emi_uf,
pe.tel as p_emi_tel,
pe.cel1 as p_emi_cel1,
pe.complemento as p_emi_complemento,
pd.nome_comp as p_dest_nome_comp,
pd.nome_red as p_dest_nome_red,
pd.cpf_cnpj as p_dest_cpf_cnpj,
pd.logradouro as p_dest_logradouro,
pd.numero as p_dest_numero,
pd.uf as p_dest_uf,
pd.tel as p_dest_tel,
pd.cel1 as p_dest_cel1,
pd.complemento as p_dest_complemento,
c.id_tabela,
f.id_fornecedor,
t.descricao as tabela,
(SELECT SUM(emi.qt*emi.valor) FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as subtotal,
(SELECT SUM(emi.desconto) FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as total_desc,
(SELECT SUM(emi.acres)  FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as total_acres ,
(SELECT (SUM(emi.qt*emi.valor)+SUM(emi.acres-emi.desconto)) FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as total
FROM estoque_mov em
INNER JOIN view_filial vf ON em.id_filial = vf.id_filial
INNER JOIN empresas emp ON vf.id_empresa = emp.id_empresa
INNER JOIN tipo_mov_estoque tmp ON em.id_tipo_mov = tmp.id_tipo_mov
LEFT JOIN pessoas pe ON em.id_pessoa_emitente = pe.id_pessoa
LEFT JOIN pessoas pd ON em.id_pessoa_destinatario = pd.id_pessoa
LEFT JOIN clientes c ON pd.id_pessoa = c.id_pessoa
LEFT JOIN fornecedor f ON pe.id_pessoa = f.id_pessoa
LEFT JOIN view_vendedor vv ON em.id_vendedor = vv.id_vendedor
LEFT JOIN tabela t ON c.id_tabela = t.id_tabela
WHERE 1
             */
        	//instanciar o modelo de dataSet
        	var dataSet = new AutomacaoProvider.provider();
        	//realizar as configurações do dataset
           
          var campos = 
              'em.id_mov,em.id_filial,em.id_pessoa_emitente,em.id_pessoa_destinatario,'+
              'em.id_tipo_mov,em.id_vendedor,em.id_tp,em.data_mov,em.status,em.numero,'+
              'em.data_emissao,em.data_saida,em.obs,'+
              'CASE WHEN em.status = "A" THEN "ABERTO" WHEN em.status = "C" THEN "CANCELADO" WHEN em.status = "F" THEN "FECHADO" END AS desc_status,'+
              'tmp.descricao as desc_tipo_mov,tmp.tipo as tipo_mov,vf.nome_comp as filial_nome_comp,vf.nome_red as filial_nome_red,'+
              'vf.logradouro as filial_logradouro,vf.cpf_cnpj as filial_cpf_cnpj,vf.numero as filial_numero,vf.cidade as filial_cidade,'+
              'vf.uf as filial_uf,vf.tel as filial_tel,emp.id_empresa,emp.slogan,vv.nome_comp as vendedor_nome_comp,vv.nome_red as vendedor_nome_red,'+
              'pe.nome_comp as p_emi_nome_comp,pe.nome_red as p_emi_nome_red,pe.cpf_cnpj as p_emi_cpf_cnpj,pe.logradouro as p_emi_logradouro,'+
              'pe.numero as p_emi_numero,pe.uf as p_emi_uf,pe.tel as p_emi_tel,pe.cel1 as p_emi_cel1,pe.complemento as p_emi_complemento,'+
              'pd.nome_comp as p_dest_nome_comp,pd.nome_red as p_dest_nome_red,pd.cpf_cnpj as p_dest_cpf_cnpj,pd.logradouro as p_dest_logradouro,'+
              'pd.numero as p_dest_numero,pd.uf as p_dest_uf,pd.tel as p_dest_tel,pd.cel1 as p_dest_cel1,pd.complemento as p_dest_complemento,'+
              'c.id_tabela,f.id_fornecedor,t.descricao as tabela,'+
              '(SELECT SUM(emi.qt*emi.valor) FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as subtotal,'+
              '(SELECT SUM(emi.desconto) as desconto FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as total_desc,'+
              '(SELECT SUM(emi.acres)FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as total_acres ,'+
              '(SELECT (SUM(emi.qt*emi.valor)+SUM(emi.acres-emi.desconto)) FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as total';

          var camposFiltro = [
            {field:"em.status",alias:"Status",type:"fixed",values:[{value:"A",alias:"Aberto"},{value:"F",alias:"Fechado"},{value:"C",alias:"Cancelado"}]},
            {field:"em.numero",alias:"Número",type:"string"},
            {field:"vv.nome_red",alias:"Vendedor",type:"string"},
          ];

          // filtroDefault é a pesquisa que ja vem padrao pelo sistema
          var filtroDefault = [
            {campo:"em.status",express:"=",value:"F",alias:"Situação",aliasValue:"Fechado",type:"fixed"},
          ];

	        var tableCols = [
	          {prop:'descricao',name:'Classificações',show:true},
	        ];
	        var inner_join = {
	            0:"view_filial vf ON em.id_filial = vf.id_filial",
              1:"empresas emp ON vf.id_empresa = emp.id_empresa",
              2:"tipo_mov_estoque tmp ON em.id_tipo_mov = tmp.id_tipo_mov",
	        };
	        var left_join = {
	            0:"pessoas pe ON em.id_pessoa_emitente = pe.id_pessoa",
              1:"pessoas pd ON em.id_pessoa_destinatario = pd.id_pessoa",
              2:"clientes c ON pd.id_pessoa = c.id_pessoa",
              3:"fornecedor f ON pe.id_pessoa = f.id_pessoa",
              4:"view_vendedor vv ON em.id_vendedor = vv.id_vendedor",
              5:"tabela t ON c.id_tabela = t.id_tabela",
	        };

            var camposInvalidos = [
              'action','desc_status','desc_tipo_mov','tipo_mov','filial_nome_comp',
              'filial_nome_red','filial_logradouro','filial_cpf_cnpj',
              'filial_numero','filial_cidade','filial_uf','filial_tel',
              'id_empresa','slogan','vendedor_nome_comp','vendedor_nome_red',
              'p_emi_nome_comp','p_emi_nome_red','p_emi_cpf_cnpj','p_emi_logradouro',
              'p_emi_numero','p_emi_uf','p_emi_tel','p_emi_cel1','p_emi_complemento',
              'p_dest_nome_comp','p_dest_nome_red','p_dest_cpf_cnpj','p_dest_logradouro',
              'p_dest_numero','p_dest_uf','p_dest_tel','p_dest_cel1','p_dest_complemento','p_dest_cidade',
              'limite_credito','total','total_desc','total_acres','id_tabela','id_fornecedor','tabela','subtotal','tabela_preco'
            ];


        	dataSet.campos         = campos;
        	dataSet.inner_join     = inner_join;
        	dataSet.left_join      = left_join;
          dataSet.id_index_main  = 'emp.id_empresa';
        	dataSet.modulo         = 'estoque_mov';
        	dataSet.moduloQuery    = 'estoque_mov em';
        	dataSet.id_tabela      = 'id_mov';
        	dataSet.id_tabelaQuery = 'em.id_mov';
          dataSet.orderBy        = 'em.data_mov';
          dataSet.filtroDefault  = filtroDefault,
        	dataSet.tableCols      = tableCols;
          dataSet.camposFiltro   = camposFiltro;
        	dataSet.camposData     = ['data_mov','data_emissao','data_saida'];
          dataSet.camposInvalidos  = camposInvalidos;
          dataSet.camposForeignKey = ['id_filial','id_tipo_mov'];//campos chave estrangeira
          dataSet.campoDataQry   = 'em.data_mov';//campo que sera filtrado por data
        	return  dataSet;

        }

        function movitens() {
            //instanciar o modelo de dataSet
            /*
SELECT 
emi.id_mov_item,
emi.id_mov,
emi.id_item,
SUM(emi.qt) as qt,
AVG(emi.valor) as valor,
SUM(emi.desconto) AS desconto,
emi.desc_perc,
SUM(emi.acres) AS acres,
(SUM(emi.qt*emi.valor)+SUM(emi.acres-emi.desconto)) as subtotal,

em.data_mov,
em.id_filial,
em.numero,
tmp.descricao as desc_tipo_mov,
tmp.tipo as tipo_mov,

i.descricao,
i.detalhes,
i.marca,
i.perc_preco,
i.preco,
i.codigo,
i.id_empresa,

iu.sigla


FROM estoque_mov_itens emi
INNER JOIN estoque_mov em ON emi.id_mov = em.id_mov
INNER JOIN tipo_mov_estoque tmp ON em.id_tipo_mov = tmp.id_tipo_mov
INNER JOIN itens i ON emi.id_item = i.id_item
LEFT JOIN item_unidade iu ON i.id_unidade = iu.id_unidade
LEFT JOIN pessoas pe ON em.id_pessoa_emitente = pe.id_pessoa
LEFT JOIN pessoas pd ON em.id_pessoa_destinatario = pd.id_pessoa
where em.id_tipo_mov = 1

group by i.id_item
             */
            var dataSet = new AutomacaoProvider.provider();
            //realizar as configurações do dataset
            var campos = ' emi.id_mov_item, emi.id_mov, emi.id_item, SUM(emi.qt) as qt, AVG(emi.valor) as valor, SUM(emi.desconto) AS desconto, emi.desc_perc, SUM(emi.acres) AS acres, (SUM(emi.qt*emi.valor)+SUM(emi.acres-emi.desconto)) as subtotal, em.data_mov, em.id_filial, em.numero, tmp.descricao as desc_tipo_mov, tmp.tipo as tipo_mov, i.descricao, i.detalhes, i.marca, i.perc_preco, i.preco, i.codigo, i.id_empresa, iu.sigla';
            var camposFiltro = [
                {field:"data_mov",alias:"Data",type:"string"}
            ];

            var tableCols = [
            ];
            var inner_join = {
              0:"estoque_mov em ON emi.id_mov = em.id_mov",
              1:"tipo_mov_estoque tmp ON em.id_tipo_mov = tmp.id_tipo_mov",
              2:"itens i ON emi.id_item = i.id_item",
            };
            var left_join = {
              0:"item_unidade iu ON i.id_unidade = iu.id_unidade",
              1:"pessoas pe ON em.id_pessoa_emitente = pe.id_pessoa",
              2:"pessoas pd ON em.id_pessoa_destinatario = pd.id_pessoa",
            };

            var camposInvalidos = [
              'action',
              'descricao',
              'detalhes',
              'marca',
              'perc_preco',
              'preco',
              'codigo',
              'id_empresa',
              'sigla',
              'categoria',
              'codigo',
              'custo',
              'data_cad',
              'fornecedor',
              'id_fornecedor',
              'id_categoria',
              'id_galeria',
              'id_unidade',
              'imagem',
              'perc_tabela',
              'ref',
              'saldo',
              'saldo_max',
              'saldo_min',
              'status',
              'razao_fornecedor',
              'desc_status',
              'desc_tabela',
              'perc_lucro',
              'data_mov',
              'id_filial',
              'numero',
              'desc_tipo_mov',
              'tipo_mov',
              'subtotal'
            ];

            dataSet.campos           = campos;
            dataSet.inner_join       = inner_join;
            dataSet.left_join        = left_join;
            dataSet.modulo           = 'estoque_mov_itens';
            dataSet.moduloQuery      = 'estoque_mov_itens emi';
            dataSet.id_tabela        = 'id_mov_item';
            dataSet.id_tabelaQuery   = 'emi.id_mov_item';
            dataSet.tableCols        = tableCols;
            dataSet.camposData       = [];
            dataSet.camposFiltro     = camposFiltro;
            dataSet.camposForeignKey = ['id_mov'];
            dataSet.valueForeignKey  = [];
            dataSet.camposInvalidos  = camposInvalidos;
            dataSet.id_index_main    = 'i.id_empresa';
            dataSet.groupBy          = 'emi.id_item';//group by da consulta sql
            dataSet.campoDataQry     = 'em.data_mov';//campo que sera filtrado por data
            return  dataSet;
        }

    }
})();

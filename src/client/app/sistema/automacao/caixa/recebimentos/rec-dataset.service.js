(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('RecDataSet', RecDataSet);
    RecDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function RecDataSet(AutomacaoProvider) {
        this.rec = rec;
        ////////////////
        function rec() {
            //instanciar o modelo de dataSet
            var dataSet = new AutomacaoProvider.provider();
            //realizar as configurações do dataset

            var campos = ' r.id_recebimento, r.id_mov, r.id_caixa, r.id_meio_pag, r.id_titulo, r.data_rec, r.n_doc, SUM(r.valor) AS valor, r.obs, r.status, e.descricao as estacao, u.nome as operador, mp.descricao as meio_pag, pm.nome_red as cliente';

            var tableCols = [
                {prop:'data_rec',name:'Data',show:true},
                {prop:'cliente',name:'Cliente',show:true},
                {prop:'meio_pag',name:'Meio de Pagamento',show:true},
                {prop:'valor',name:'Valor',show:true},
            ];
            var camposFiltro = [
                {field:"mp.descricao",alias:"Meio de Pagamento",type:"string"},
                {field:"r.n_doc",alias:"Nº Documento",type:"string"},
                {field:"pm.nome_red",alias:"Cliente",type:"string"},
                {field:"u.nome",alias:"Operador",type:"string"},
            ];

            var inner_join = {
                0:"caixa c ON r.id_caixa = c.id_caixa",
                1:"filial f ON c.id_filial = f.id_filial",
                2:"estacao e ON c.id_estacao = e.id_estacao",
                3:"usuarios u ON c.id_usuario = u.id_usuario",
                4:"meios_pag mp ON r.id_meio_pag = mp.id_meio_pag",
            };
            var left_join = {
                0:"estoque_mov em ON r.id_mov = em.id_mov",
                1:"pessoas pm ON em.id_pessoa_destinatario = pm.id_pessoa",
            };

            var camposInvalidos = ['action','estacao','operador','meio_pag','cliente'];

            dataSet.campos         = campos;
            dataSet.inner_join     = inner_join;
            dataSet.left_join      = left_join;
            dataSet.modulo         = 'recebimentos';
            dataSet.moduloQuery    = 'recebimentos r';
            dataSet.id_tabela      = 'id_recebimento';
            dataSet.id_tabelaQuery = 'r.id_recebimento';
            dataSet.orderBy        = 'r.id_recebimento'; 
            dataSet.tableCols      = tableCols;
            dataSet.camposData     = ['data_rec'];
            dataSet.camposInvalidos= camposInvalidos;
            dataSet.camposFiltro   = camposFiltro;
            dataSet.id_index_main  = 'f.id_empresa';
            dataSet.groupBy        = 'r.id_recebimento';//group by da consulta sql
            //dataSet.campoDataQry   = 'r.data_rec';//campo que sera filtrado por data
            return  dataSet;
        }

    }
})();
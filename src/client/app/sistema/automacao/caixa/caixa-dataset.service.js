(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('CaixaDataSet', CaixaDataSet);
    CaixaDataSet.$inject = ['AutomacaoProvider'];
    /* @ngInject */
    function CaixaDataSet(AutomacaoProvider) {
        this.caixa = caixa;
        ////////////////
        function caixa() {
            //instanciar o modelo de dataSet
            var dataSet = new AutomacaoProvider.provider();
            //realizar as configurações do dataset

            var campos = 'c.id_caixa, c.id_filial, c.id_usuario, c.id_estacao, c.data_ini, c.data_fim, c.status, c.suprimento, CASE WHEN c.status = "A" THEN "ABERTO" ELSE "FECHADO" END AS desc_status, u.nome as operador, e.descricao as estacao, pf.nome_red as filial';

            var tableCols = [
              {prop:'estacao',name:'PDV',show:true},
              {prop:'desc_status',name:'Status',show:true},
              {prop:'operador',name:'Operador',show:true},
            ];
            var camposFiltro = [
                {field:"c.status",alias:"Status",type:"fixed",values:[{value:'A',alias:"ABERTO"},{value:'F',alias:"FECHADO"}]},
            ];

            var inner_join = {
                0:"filial f ON c.id_filial = f.id_filial",
                1:"usuarios u ON c.id_usuario = u.id_usuario",
                2:"estacao e ON c.id_estacao = e.id_estacao",
                3:"pessoas pf on f.id_pessoa = pf.id_pessoa",
            };
            var camposInvalidos = ['action','desc_status','operador','estacao','filial'];

            dataSet.campos         = campos;
            dataSet.inner_join     = inner_join;
            dataSet.modulo         = 'caixa';
            dataSet.moduloQuery    = 'caixa c';
            dataSet.id_tabela      = 'id_caixa';
            dataSet.id_tabelaQuery = 'c.id_caixa';
            dataSet.orderBy        = 'c.id_caixa'; 
            dataSet.tableCols      = tableCols;
            dataSet.camposData     = ['data_ini','data_fim'];
            dataSet.camposInvalidos= camposInvalidos;
            dataSet.camposFiltro   = camposFiltro;
            dataSet.id_index_main  = 'f.id_empresa';
            dataSet.campoDataQry   = 'c.data_ini';//campo que sera filtrado por data
            return  dataSet;
        }

    }
})();